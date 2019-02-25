L.Draw.AttackArrow = L.Draw.SimpleShape.extend({
	statics: {
		TYPE: 'AttackArrow'
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
		this.type = L.Draw.AttackArrow.TYPE;

		this._initialLabelText = L.drawLocal.draw.handlers.AttackArrow.tooltip.start;

		L.Draw.SimpleShape.prototype.initialize.call(this, map, options);
	},

	_drawShape: function (latlng) {
		if (!this._shape) {
			this._shape = new L.AttackArrow(this._startLatLng, latlng, this.options.shapeOptions);
			this._map.addLayer(this._shape);
		} else {
			/*var radius = this._startLatLng.distanceTo(latlng);
			this._shape.setRadius([radius, radius]);*/
		}
	},

	_fireCreatedEvent: function () {
		var AttackArrow = new L.AttackArrow(this._startLatLng, [this._shape.y, this._shape.x], this.options.shapeOptions);
		L.Draw.SimpleShape.prototype._fireCreatedEvent.call(this, AttackArrow);
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