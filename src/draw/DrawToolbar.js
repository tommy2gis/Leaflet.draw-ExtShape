L.DrawToolbar.addInitHook(function () {
	this.options.FineArrow = {};
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
				enabled: this.options.FineArrow,
				handler: new L.Draw.Ellipse(map, this.options.FineArrow),
				title: L.drawLocal.draw.toolbar.buttons.FineArrow
			},
			{
				enabled: this.options.AttackArrow,
				handler: new L.Draw.Ellipse(map, this.options.AttackArrow),
				title: L.drawLocal.draw.toolbar.buttons.AttackArrow
			},
			
		];
	};
});