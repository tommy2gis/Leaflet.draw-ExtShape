/*
	Leaflet.draw-FineArrow, a plugin that adds FineArrow drawing and editing tools to Leaflet powered maps.
	(c) 2015-2016, Haley Quentmeyer
	https://github.com/haleystorm/Leaflet.draw-FineArrow
	https://github.com/Leaflet/Leaflet.draw
	http://leafletjs.com
*/
(function (window, document, undefined) {/*
	* Leaflet.draw-FineArrow assumes that you have already included the Leaflet, Leaflet-draw, and Leaflet-FineArrow libraries.
	*/
   
   L.drawLocal.draw.toolbar.buttons.AttackArrow = 'Draw an AttackArrow';
   
   L.drawLocal.draw.handlers.AttackArrow = {
	   tooltip: {
		   start: 'Click and drag to draw AttackArrow.'
	   }
   };
   
   L.Draw.AttackArrow = L.Draw.Feature.extend({
	statics: {
		TYPE: 'attackarrow'
	},

	Poly: L.AttackArrow,

	options: {
		icon: new L.DivIcon({
			iconSize: new L.Point(8, 8),
			className: 'leaflet-div-icon leaflet-editing-icon'
		}),
		shapeOptions: {
			stroke: true,
			color: '#f06eaa',
			weight: 4,
			opacity: 0.5,
			fill: true,
			fillColor: null, //same as color by default
			fillOpacity: 0.2,
			clickable: true
		},
		showRadius: true,
		metric: true // Whether to use the metric measurement system or imperial
	},

	initialize: function (map, options) {
		// Save the type so super can fire, need to do this as cannot do this.TYPE :(
		this.type = L.Draw.AttackArrow.TYPE;

		this._initialLabelText = L.drawLocal.draw.handlers.AttackArrow.tooltip.start;

		L.Draw.SimpleShape.prototype.initialize.call(this, map, options);
	},
	addHooks: function () {
		L.Draw.Feature.prototype.addHooks.call(this);
		if (this._map) {
			this._markers = [];

			this._markerGroup = new L.LayerGroup();
			this._map.addLayer(this._markerGroup);

			this._poly = new L.AttackArrow([], this.options.shapeOptions);

			//this._tooltip.updateContent(this._getTooltipText());

			// Make a transparent marker that will used to catch click events. These click
			// events will create the vertices. We need to do this so we can ensure that
			// we can create vertices over other map layers (markers, vector layers). We
			// also do not want to trigger any click handlers of objects we are clicking on
			// while drawing.
			if (!this._mouseMarker) {
				this._mouseMarker = L.marker(this._map.getCenter(), {
					icon: L.divIcon({
						className: 'leaflet-mouse-marker',
						iconAnchor: [20, 20],
						iconSize: [40, 40]
					}),
					opacity: 0,
					zIndexOffset: this.options.zIndexOffset
				});
			}

			if (!L.Browser.touch) {
				this._map.on('mouseup', this._onMouseUp, this); // Necessary for 0.7 compatibility
			}

			this._mouseMarker
				// .on('mousedown', this._onMouseDown, this)
				// .on('mouseout', this._onMouseOut, this)
				// .on('mouseup', this._onMouseUp, this) // Necessary for 0.8 compatibility
				.on('mousemove', this._onMouseMove, this) // Necessary to prevent 0.8 stutter
				.addTo(this._map);

			this._map
				.on('mouseup', this._onMouseUp, this) // Necessary for 0.7 compatibility
				.on('mousemove', this._onMouseMove, this)
				.on('zoomlevelschange', this._onZoomEnd, this)
				.on('click', this._onTouch, this)
				.on('zoomend', this._onZoomEnd, this);
		}
	},

	_cleanUpShape: function () {
		if (this._markers.length > 1) {
			this._markers[this._markers.length - 1].off('click', this._finishShape, this);
		}
	},

	_fireCreatedEvent: function () {
		var poly = new this.Poly(this._poly.getLatLngs(), this.options.shapeOptions);
		L.Draw.Feature.prototype._fireCreatedEvent.call(this, poly);
	},

	removeHooks: function () {
		L.Draw.Feature.prototype.removeHooks.call(this);

		//this._clearHideErrorTimeout();

		this._cleanUpShape();

		// remove markers from map
		this._map.removeLayer(this._markerGroup);
		delete this._markerGroup;
		delete this._markers;

		this._map.removeLayer(this._poly);
		delete this._poly;

		this._mouseMarker
			// .off('mousedown', this._onMouseDown, this)
			// .off('mouseout', this._onMouseOut, this)
			// .off('mouseup', this._onMouseUp, this)
			.off('mousemove', this._onMouseMove, this);
		this._map.removeLayer(this._mouseMarker);
		delete this._mouseMarker;

		// clean up DOM
		//this._clearGuides();

		this._map
			.off('mouseup', this._onMouseUp, this)
			.off('mousemove', this._onMouseMove, this)
			.off('zoomlevelschange', this._onZoomEnd, this)
			.off('zoomend', this._onZoomEnd, this)
			.off('click', this._onTouch, this);
	},

	_onMouseMove: function (e) {
		var newPos = this._map.mouseEventToLayerPoint(e.originalEvent);
		var latlng = this._map.layerPointToLatLng(newPos);

		// Save latlng
		// should this be moved to _updateGuide() ?
		this._currentLatLng = latlng;

		//this._updateTooltip(latlng);

		// Update the guide line
		//this._updateGuide(newPos);

		// Update the mouse marker position

		// if (this._isDrawing) {
		// 	this._poly.updateLastLatLng(latlng);

		// 	/*this._tooltip.updateContent({
		// 		text: this._endLabelText,
		// 		subtext: showRadius ? L.drawLocal.draw.handlers.ellipse.radius + ': ' + L.GeometryUtil.readableDistance(radius, useMetric) : ''
		// 	});*/
		// }

		
		this._mouseMarker.setLatLng(latlng);

		L.DomEvent.preventDefault(e.originalEvent);
	},

	_createMarker: function (latlng) {
		var marker = new L.Marker(latlng, {
			icon: this.options.icon,
			zIndexOffset: this.options.zIndexOffset * 2
		});

		this._markerGroup.addLayer(marker);

		return marker;
	},

	addVertex: function (latlng) {
		var markersLength = this._markers.length;

		// if (markersLength > 0 && !this.options.allowIntersection && this._poly.newLatLngIntersects(latlng)) {
		// 	this._showErrorTooltip();
		// 	return;
		// }
		// else if (this._errorShown) {
		// 	this._hideErrorTooltip();
		// }

		this._markers.push(this._createMarker(latlng));

		this._poly.addLatLng(latlng);

		if (this._poly.getLatLngs().length === 2) {
			this._map.addLayer(this._poly);
		}

		this._vertexChanged(latlng, true);
	},

	_vertexChanged: function (latlng, added) {
		this._map.fire('draw:drawvertex', { layers: this._markerGroup });
		this._updateFinishHandler();

		//this._updateRunningMeasure(latlng, added);

		//this._clearGuides();

		//this._updateTooltip();
	},

	completeShape: function () {
		if (this._markers.length <= 1) {
			return;
		}

		this._fireCreatedEvent();
		this.disable();

		if (this.options.repeatMode) {
			this.enable();
		}
	},


	_updateFinishHandler: function () {
		var markerCount = this._markers.length;
		// The last marker should have a click handler to close the polyline
		if (markerCount > 1) {
			this._markers[markerCount - 1].on('click', this._finishShape, this);
		}

		// Remove the old marker click handler (as only the last point should close the polyline)
		if (markerCount > 2) {
			this._markers[markerCount - 2].off('click', this._finishShape, this);
		}
	},

	_finishShape: function () {
		// var latlngs = this._poly._defaultShape ? this._poly._defaultShape() : this._poly.getLatLngs();
		// var intersects = this._poly.newLatLngIntersects(latlngs[latlngs.length - 1]);

		// if ((!this.options.allowIntersection && intersects) || !this._shapeIsValid()) {
		// 	this._showErrorTooltip();
		// 	return;
		// }

		this._fireCreatedEvent();
		this.disable();
		if (this.options.repeatMode) {
			this.enable();
		}
	},


	_onMouseDown: function (e) {
		var originalEvent = e.originalEvent;
		this._mouseDownOrigin = L.point(originalEvent.clientX, originalEvent.clientY);
	},

	_onMouseUp: function (e) {
		if (this._mouseDownOrigin) {
			// We detect clicks within a certain tolerance, otherwise let it
			// be interpreted as a drag by the map
			var distance = L.point(e.originalEvent.clientX, e.originalEvent.clientY)
				.distanceTo(this._mouseDownOrigin);
			if (Math.abs(distance) < 9 * (window.devicePixelRatio || 1)) {
				this.addVertex(e.latlng);
			}
		}
		this._mouseDownOrigin = null;
	},

	_onTouch: function (e) {
		// #TODO: use touchstart and touchend vs using click(touch start & end).
		if (L.Browser.touch) { // #TODO: get rid of this once leaflet fixes their click/touch.
			this._onMouseDown(e);
			this._onMouseUp(e);
		}
	},

	_onMouseOut: function () {
		if (this._tooltip) {
			this._tooltip._onMouseOut.call(this._tooltip);
		}
	},
	
});
   
   
   L.DrawToolbar.addInitHook(function () {
	   this.options.AttackArrow = {};
	   this.getModeHandlers = function (map) {
		   return [
			   {
				   enabled: this.options.polyline,
				   handler: new L.Draw.Polyline(map, this.options.polyline),
				   title: L.drawLocal.draw.toolbar.buttons.polyline
			   },
			   {
				   enabled: this.options.polygon,
				   handler: new L.Draw.Polygon(map, this.options.polygon),
				   title: L.drawLocal.draw.toolbar.buttons.polygon
			   },
			   {
				   enabled: this.options.rectangle,
				   handler: new L.Draw.Rectangle(map, this.options.rectangle),
				   title: L.drawLocal.draw.toolbar.buttons.rectangle
			   },
			   {
				   enabled: this.options.circle,
				   handler: new L.Draw.Circle(map, this.options.circle),
				   title: L.drawLocal.draw.toolbar.buttons.circle
			   },
			   {
				   enabled: this.options.marker,
				   handler: new L.Draw.Marker(map, this.options.marker),
				   title: L.drawLocal.draw.toolbar.buttons.marker
			   },
			   {
				   enabled: this.options.AttackArrow,
				   handler: new L.Draw.AttackArrow(map, this.options.AttackArrow),
				   title: L.drawLocal.draw.toolbar.buttons.AttackArrow
			   },
			   
		   ];
	   };
   });
   
   
   }(window, document));