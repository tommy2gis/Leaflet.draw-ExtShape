/*
	Leaflet.draw-FineArrow, a plugin that adds FineArrow drawing and editing tools to Leaflet powered maps.
	(c) 2015-2016, Haley Quentmeyer
	https://github.com/haleystorm/Leaflet.draw-FineArrow
	https://github.com/Leaflet/Leaflet.draw
	http://leafletjs.com
	https://github.com/haleystorm
*/
(function (window, document, undefined) {/*
 * Leaflet.draw-FineArrow assumes that you have already included the Leaflet, Leaflet-draw, and Leaflet-FineArrow libraries.
 */

L.drawLocal.draw.toolbar.buttons.FineArrow = 'Draw an FineArrow';

L.drawLocal.draw.handlers.FineArrow = {
	tooltip: {
		start: 'Click and drag to draw FineArrow.'
	},
	radius: 'Radius'
};

L.Draw.FineArrow = L.Draw.SimpleShape.extend({
	statics: {
		TYPE: 'FineArrow'
	},

	options: {
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
		this.type = L.Draw.FineArrow.TYPE;

		this._initialLabelText = L.drawLocal.draw.handlers.FineArrow.tooltip.start;

		L.Draw.SimpleShape.prototype.initialize.call(this, map, options);
	},

	_drawShape: function (latlng) {
		if (!this._shape) {
			this._endLatlng=latlng;
			this._shape = new L.FineArrow([[this._startLatLng.lng,this._startLatLng.lat], [latlng.lng,latlng.lat]], this.options.shapeOptions);
			this._map.addLayer(this._shape);
		} else {
			this._endLatlng=latlng;
			this._shape.setLatLngs([[this._startLatLng.lng,this._startLatLng.lat], [latlng.lng,latlng.lat]]);
		}
	},

	_fireCreatedEvent: function () {
		var fineArrow = new L.FineArrow([[this._startLatLng.lng,this._startLatLng.lat], [this._endLatlng.lng,this._endLatlng.lat]], this.options.shapeOptions);
		L.Draw.SimpleShape.prototype._fireCreatedEvent.call(this, fineArrow);
	},

	_onMouseMove: function (e) {
		var latlng = e.latlng;
		this._tooltip.updatePosition(latlng);
		if (this._isDrawing) {
			this._drawShape(latlng);

			/*this._tooltip.updateContent({
				text: this._endLabelText,
				subtext: showRadius ? L.drawLocal.draw.handlers.ellipse.radius + ': ' + L.GeometryUtil.readableDistance(radius, useMetric) : ''
			});*/
		}
	}
});


L.DrawToolbar.addInitHook(function () {
	this.options.FineArrow = {};
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
				enabled: this.options.FineArrow,
				handler: new L.Draw.FineArrow(map, this.options.FineArrow),
				title: L.drawLocal.draw.toolbar.buttons.FineArrow
			}
		];
	};
});


}(window, document));