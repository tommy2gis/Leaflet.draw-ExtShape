

   L.Draw.Curve = L.Draw.Polyline.extend({
	statics: {
		TYPE: 'Curve'
	},

	Poly: L.Curve,


	initialize: function (map, options) {
		// Save the type so super can fire, need to do this as cannot do this.TYPE :(
		this.type = L.Draw.Curve.TYPE;

		this._initialLabelText = '点击地图开始绘制';

		L.Draw.Polyline.prototype.initialize.call(this, map, options);
	},
	addHooks: function () {
		L.Draw.Polyline.prototype.addHooks.call(this);
		if (this._map) {
			this._markers = [];

			this._markerGroup = new L.LayerGroup();
			this._map.addLayer(this._markerGroup);

			this._poly = new L.Curve([], this.options.shapeOptions);

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
				 .on('mousedown', this._onMouseDown, this)
				 .on('mouseout', this._onMouseOut, this)
				 .on('mouseup', this._onMouseUp, this) // Necessary for 0.8 compatibility
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


	_fireCreatedEvent: function () {
		L.Draw.Feature.prototype._fireCreatedEvent.call(this, this._poly);
	},

	
	
});
   
