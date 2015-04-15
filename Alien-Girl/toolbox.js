function SpriteBox(element, editor, spriteTable)
{
	this.element = document.getElementById(element);
	this.images = [];

	this.select = function(target)
	{
		for(var i = 0; i < spriteTable.length; i++) {
			if(this.images[i] == target) {
				var key = spriteTable[i]['key'];
				this.images[i].setAttribute("class", "selected");
				editor.setSprite(key[0] * 256 + key[1]);
			} else {
				this.images[i].setAttribute("class", "sprite");
			}
		}
	}

	for(var i = 0; i < spriteTable.length; i++) {

		this.images[i] = document.createElement("img");
		
		var src = spriteTable[i]['src'];
		
		if ('frames' in spriteTable[i])
			src += '_1';
		
		this.images[i].src = 'tiles/' + src + '.png';
		this.images[i].setAttribute("class", "sprite");
		
		this.images[i].onclick = function(e) {
			this.select(e.target);
		}.bind(this);
	
		this.element.appendChild(this.images[i]);
	}
}
