String.prototype.clr = function (hexColor) { return `<font color='#${hexColor}'>${this}</font>` };

const	fs = require('fs');

module.exports = function field_boss_time(mod) {
	
	const command = mod.command;
	
	var bams = require('./saved.json'),
		changed = false;
				
	function getBamName(id)
	{
		switch (id)
		{
			case "@creature:26#5001": return "Ortan";
			case "@creature:51#4001": return "Cerrus";
			case "@creature:39#501": return "Hazard";
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
	
	function saveJson(obj)
	{
		if (Object.keys(obj).length && changed)
		{
			try
			{
				fs.writeFileSync('./saved.json', JSON.stringify(obj, null, "\t"));
				changed = false;
			}
			catch (err)
			{
				console.log(err);
				return false;
			}
		}
	}
			
	process.on('exit', ()=> {
		console.log('Saving field-boss times to the save file...');
		saveJson(bams);
	});
	
	this.destructor = function() {
		console.log('Destructor: Saving field-boss times to the save file...');
		saveJson(bams);
	}
	
	mod.hook('S_SYSTEM_MESSAGE', 1, event => {		
		const msg = mod.parseSystemMessage(event.message);
		if(msg.id === 'SMT_FIELDBOSS_APPEAR')
		{
			//console.log(msg);
			changed = true;
			let name = getBamName(msg.tokens.npcName);
			bams[name] = "Alive".clr("32CD32");
			command.message("Field Boss " + name.clr("56B4E9") + " appeared".clr("32CD32"));
		}
		else if(msg.id === 'SMT_FIELDBOSS_DIE_GUILD' || msg.id === 'SMT_FIELDBOSS_DIE_NOGUILD')
		{
			//console.log(msg);
			changed = true;
			let name = getBamName(msg.tokens.npcname);
			command.message("Field Boss " + name.clr("56B4E9") + " was " + "killed".clr("DC143C") + " by " + msg.tokens.userName);
			let now = new Date();
			let nextTime = new Date(now.getTime() + 5*60*60000); // in 5 hours
			let nextTimeHuman = addZero(nextTime.getHours()) + ":" + addZero(nextTime.getMinutes());
			bams[name] = "Respawns on " + nextTimeHuman.clr("E69F00");
			console.log(name + ": " + "Respawns on: " + nextTimeHuman);
			command.message(name + ": " + bams[name]);
			saveJson(bams);
		}
	});

	command.add('bamtime', () => {
		command.message("Ortan: ".clr("56B4E9") + bams.Ortan);
		command.message("Cerrus: ".clr("56B4E9") + bams.Cerrus);
		command.message("Hazard: ".clr("56B4E9") + bams.Hazard);
	})
}
