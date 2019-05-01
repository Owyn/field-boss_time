String.prototype.clr = function (hexColor) { return `<font color='#${hexColor}'>${this}</font>` };

module.exports = function field_boss_time(mod) {
	
	const command = mod.command;
	
	var bams = {Ortan: "?",
				Cerrus: "?",
				Hazard : "?"};
				
	function getBamName(id)
	{
		switch (id)
		{
			case "@creature:26#5001": return "Ortan";
			case "@creature:26#4001": return "Cerrus";
			case "@creature:26#501": return "Hazard";
			default: return "John Cena";
		}
	}
	
	function addZero(i) 
	{
		if (i < 10) {
			i = "0" + i;
		}
		return i;
	}
	
	mod.hook('S_SYSTEM_MESSAGE', 1, event => {		
		const msg = mod.parseSystemMessage(event.message);
		if(msg.id === 'SMT_FIELDBOSS_APPEAR')
		{
			let name = getBamName(msg.tokens.npcName);
			bams[name] = "Alive".clr("32CD32");
			command.message("Field Boss " + name.clr("56B4E9") + " appeared".clr("32CD32"));
		}
		else if(msg.id === 'SMT_FIELDBOSS_DIE_GUILD' || msg.id === 'SMT_FIELDBOSS_DIE_NOGUILD')
		{
			let name = getBamName(msg.tokens.npcname);
			command.message("Field Boss " + name.clr("56B4E9") + " was " + "killed".clr("DC143C") + " by " + msg.tokens.userName);
			let now = new Date();
			var nextTime = new Date(now.getTime() + 5*60*60000); // in 5 hours
			bams[name] = "Respawns on " + (addZero(nextTime.getHours()) + ":" + addZero(nextTime.getMinutes())).clr("E69F00");
			console.log(name + ": " + bams[name]);
			command.message(name + ": " + bams[name]);
		}
	});

	command.add('bamtime', () => {
		command.message("Ortan: ".clr("56B4E9") + bams.Ortan);
		command.message("Cerrus: ".clr("56B4E9") + bams.Cerrus);
		command.message("Hazard: ".clr("56B4E9") + bams.Hazard);
	})
}
