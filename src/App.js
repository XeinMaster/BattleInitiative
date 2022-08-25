import './App.css';
import React from 'react'
import $ from 'jquery';
import dnd_logo from "./img/DnD_logo.png";
import BI_logo from "./img/BI_logo.png";


function Header() {
	return (
		

		
		
	);
}

function MainDivs() {

	var Character = function(name, initiative, hp, hp_edit, status, armor){
		this.name = name || "";
		this.initiative = initiative || 0;
		this.hp = hp || 0;
		this.hp_edit = hp_edit || 0;
		this.status = status || "";
		this.armor = armor || 10;
	
		this.appendTo = function(target){
			var thisObj = this;
			var inserted = false;
			var str = "";
			str += "<tr class='battle-character' data-init='" + this.initiative + "'>";
			str += "<td class='battle-character-name' contenteditable>" + this.name + "</td>";
			str += "<td class='battle-character-initiative' contenteditable>" + this.initiative + "</td>";
			str += "<td class='battle-character-hp' contenteditable>" + this.hp + "</td>";
			str += "<td class='battle-character-hp-edit' contenteditable>" + this.hp_edit + "</td>";
			str += "<td class='battle-character-status' contenteditable>" + this.status + "</td>";
			str += "<td class='battle-character-armor' contenteditable>" + this.armor + "</td>";
			str += "<td class='battle-character-erase'><button><i class='fa fa-erase'></i> Erase</button></td>";
			str += "</tr>";
			console.log("Zambomba insertar personaje");
			
			$(str).insertBefore($('#add-new-battle-character'));
			inserted = true;
			SortInitiative();
		}
	};
	
	function AddCharacter() {
		//get values
		var name = $('#add-new-battle-character .battle-character-name input').val();
		var init = $('#add-new-battle-character .battle-character-initiative input').val();
		var hp = $('#add-new-battle-character .battle-character-hp input').val();
		var hp_edit = $('#add-new-battle-character .battle-character-hp-edit input').val();
		var status = $('#add-new-battle-character .battle-character-status input').val();
		var armor = $('#add-new-battle-character .battle-character-armor input').val();
		
		//create and append character
		var member = new Character(name, init, hp, hp_edit, status, armor);
		member.appendTo('#battle-character-list tbody');
		
		//clear inputs
		$('input').not(':button, :submit, :reset, :hidden').val('').removeAttr('checked').removeAttr('selected');
	};
	
	$('#battle-character-list').on('click', '.battle-character-erase button', function(){
		$(this).closest('.battle-character').remove();
	});
	
	$('#battle-character-list').on('blur', ".battle-character .battle-character-initiative", function(){
		ReinsertIntoCharacterList($(this).closest('.battle-character'));
	})

	
	function ReinsertIntoCharacterList(character){
		var name = character.find('.battle-character-name').html();
		var init = character.find('.battle-character-initiative').html();
		var hp = character.find('.battle-character-hp').html();
		var hp_edit = character.find('.battle-character-hp-edit').html();
		var status = character.find('.battle-character-status').html();
		var armor = character.find('.battle-character-armor').html();
		character.remove();
		
		//create and append new character
		var newCharacter = new Character(name, init, hp, hp_edit, status, armor);
		newCharacter.appendTo('#battle-character-list tbody');
	};
	
	function SortInitiative(){
		var $characters = $('.battle-character');
		var iNums = [];
		var characters = [];
		$characters.each(function(){
			var init = parseInt($(this).attr("data-init"));
			if (iNums.indexOf(init) < 0) iNums.push(init);
		})
		iNums.sort(function(a, b) {
		return a - b;
		});
		for (var i=0;i<iNums.length;i++){
			$characters = $('.battle-character[data-init=' + iNums[i] + ']');
			characters.push($characters)
		}
		$characters.remove();
		for (var j=0; j<characters.length; j++){
			$('#add-new-battle-character').parent().prepend(characters[j]);
		}
	};
	
	function TrueStart() {
		$('#starting-button-and-tutorial').toggle();
		$('#start-hidden').toggle();
		
	};
	
		<div className="header_div">
			<div>
				<img className="logo" id="DND_logo" src={dnd_logo} alt="Dungeons and Dungeons logo"></img>
			</div>

			<div>
				<img className="logo" id="BI_logo" src={BI_logo} alt="Battle Initiative logo"></img>
			</div>
		</div>
		<div className="init-div">
			<div id="starting-button-and-tutorial">
				<div id="tutorial">
					Texto tutorial
				</div>
	
				<div id="starting-button">
					<button name="start-button" onClick={TrueStart}>Start initiative</button>
				</div>
			</div>

			<div id="start-hidden">
				<table className="battle-character-list" cellSpacing="0">
					<thead>
						<tr className="battle-character-list-header">
							<th>Name</th>
							<th>Init</th>
							<th>HP</th>
							<th>&nbsp;</th>
							<th>Status</th>
							<th>AC</th>
							<th>&nbsp;</th>
						</tr>
					</thead>
					<tbody>
						<tr id="add-new-battle-character">
							<td className="battle-character-name">
								<input type="text"></input>
							</td>
		
							<td className="battle-character-initiative">
								<input type="number" min="0"></input>
							</td>
		
							<td className="battle-character-hp">
								<input type="number"></input>
							</td>
		
							<td className="battle-character-hp-edit">
								&nbsp;
							</td>
		
							<td className="battle-character-status">
								<input type="text"></input>
							</td>
		
							<td className="battle-character-armor">
								<input type="number" min="0" max="99"></input>
							</td>
		
							<td>
								<button id="add-character-button" onClick={AddCharacter}>Add character</button>
							</td>
						</tr>
					</tbody>
		
				</table>
			</div>
		</div>
};


export {Header, MainDivs};