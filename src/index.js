import React from 'react';
import ReactDOM from 'react-dom/client';
import $ from 'jquery';
import './index.css';
import dnd_logo from "./img/DnD_logo.png";
import BI_logo from "./img/BI_logo.png";
import reportWebVitals from './reportWebVitals';


var names_list_selector = [];
var fighter_total_num = 0;
var selected_names = [];

var Character = function(name, initiative, hp, hp_edit, status, armor){
	this.name = name || "";
	this.initiative = initiative || 0;
	this.hp = hp || 0;
	this.hp_edit = hp_edit || "";
	this.status = status || "";
	this.armor = armor || 10;

	this.appendTo = function(target){
		var str = "";
		str += "<tr class='battle-character' data-init='" + this.initiative + "'>";
		str += "<td class='battle-character-name name-selection-td editable' contenteditable>" + this.name + "</td>";
		str += "<td class='battle-character-initiative editable' contenteditable>" + this.initiative + "</td>";
		str += "<td class='battle-character-hp editable' contenteditable>" + this.hp + "</td>";
		// hp-edit will be implemented in the future
		str += "<td class='battle-character-hp-edit editable' contenteditable>" + this.hp_edit + "</td>";
		str += "<td class='battle-character-status editable' contenteditable>" + this.status + "</td>";
		str += "<td class='battle-character-armor editable' contenteditable>" + this.armor + "</td>";
		str += "<td class='battle-character-erase'><button class='erase-button' onCLick={this.closest('.battle-character').remove()}>Erase</button></td>";
		str += "</tr>";
		
		$(str).insertBefore($('#add-new-battle-character'));
		SortInitiative();
	}
};

var Fighter = function(f_name, attacks, hit_bon, dice_num, dice, dmg_bonus, adv, armor_obj){
	this.f_name = f_name || "";
	this.attacks = attacks || 1;
	this.hit_bon = hit_bon || 0;
	this.dice_num = dice_num || 0;
	this.dice = dice || "";
	this.dmg_bonus = dmg_bonus || 0;
	this.adv = adv;
	this.armor_obj = armor_obj || 10;

	this.appendTo = function(target){
		var str = "";
		str += "<tr class='battle-fighter' id='fighter-" + fighter_total_num + "'>";
		str += "<td class='battle-fighter-name'> <select class='name-fighter-selector name-fighter-dyn'> <option value='" + this.f_name + "' selected hidden>" + this.f_name + "</option></select></td>";
		str += "<td class='battle-fighter-attacks' contenteditable>" + this.attacks + "</td>";
		str += "<td class='battle-fighter-hit-bonus' contenteditable>" + this.hit_bon + "</td>";
		str += "<td class='battle-fighter-dice-number' contenteditable>" + this.dice_num + "</td>";
		str += "<td class='battle-fighter-dice-type'> <select class='dice-type-selector-dyn'> <option value='" + this.dice + "' selected hidden>" + this.dice + "</option> <option value='d4'>d4</option> <option value='d6'>d6</option> <option value='d8'>d8</option> <option value='d10'>d10</option> <option value='d12'>d12</option> <option value='d20'>d20</option> <option value='d100'>d100</option> </td>";
		str += "<td class='battle-fighter-dmg-bonus' contenteditable>" + this.dmg_bonus + "</td>";
		str += "<td class='battle-fighter-adventage'><input class='battle-fighter-adv-check battle-fighter-adv-check-dyn' type='checkbox'></input></td>";
		str += "<td class='battle-fighter-armor-objective' contenteditable>" + this.armor_obj + "</td>";
		str += "<td class='battle-fighter-erase'><button class='erase-button' onCLick={this.closest('.battle-fighter').remove()}>Erase</button></td>";
		str += "</tr>";
		
		$(str).insertBefore($('#add-new-battle-fighter'));
		let adv_check = $(".battle-fighter-adv-check-dyn");
		if (adv === true) {
			$($(".battle-fighter-adv-check-dyn")[adv_check.length - 1]).prop("checked", true);
		} else {
			$($(".battle-fighter-adv-check-dyn")[adv_check.length - 1]).prop("checked", false);
		};
		fighter_total_num += 1;
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
	ResetBlur();
	
	//clear inputs
	$('input').not(':button, :submit, :reset, :hidden').val('').removeAttr('checked').removeAttr('selected');
};

function AddFighter() {
	//get values
	var f_name = $('#add-new-battle-fighter .battle-fighter-name select').val();
	var attacks = $('#add-new-battle-fighter .battle-fighter-attacks input').val();
	var hit_bon = $('#add-new-battle-fighter .battle-fighter-hit-bonus input').val();
	var dice_num = $('#add-new-battle-fighter .battle-fighter-dice-number input').val();
	var dice = $('#add-new-battle-fighter .battle-fighter-dice-type select').val();
	var dmg_bonus = $('#add-new-battle-fighter .battle-fighter-dmg-bonus input').val();
	var adv = $('#add-new-battle-fighter .battle-fighter-adventage input').is(':checked');
	var armor_obj = $('#add-new-battle-fighter .battle-fighter-armor-objective input').val();
	
	//create and append character
	var member = new Fighter(f_name, attacks, hit_bon, dice_num, dice, dmg_bonus, adv, armor_obj);
	member.appendTo('.battle-fighter-list tbody');
	//make sure first selected value is added to the list
	selected_names.push(f_name);
	ResetSelect();

	//clear inputs
	$('input').not(':button, :submit, :reset, :hidden').val('').removeAttr('checked').removeAttr('selected');
};



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
	newCharacter.appendTo('.battle-character-list tbody');
	ResetBlur();
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


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<div className="main-html-div">
		<div className="header_div">
			<div>
				<img className="logo" id="DND_logo" src={dnd_logo} alt="Dungeons and Dungeons logo"></img>
			</div>

			<div>
				<img className="logo" id="BI_logo" src={BI_logo} alt="Battle Initiative logo"></img>
			</div>
		</div>
		<div id="body-div">
			<div id="init-div">
				<div>
					<table className="battle-character-list" cellSpacing="0">
						<thead>
							<tr className="battle-character-list-header">
								<th id="battle-basic-name">Name</th>
								<th id="battle-basic-init">Init</th>
								<th id="battle-basic-hp">HP</th>
								<th id="battle-basic-hp-edit">&nbsp;</th>
								<th id="battle-basic-status">Status</th>
								<th id="battle-basic-ac">AC</th>
								<th id="battle-basic-button">&nbsp;</th>
							</tr>
						</thead>
						<tbody>
							<tr id="add-new-battle-character">
								<td className="battle-character-name">
									<input type="text" id='refrescable'></input>
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
			
								<td className="battle-character-button">
									<button id="add-character-button" onClick={AddCharacter}>Add character</button>
								</td>
							</tr>
						</tbody>
			
					</table>
				</div>
			</div>

			<div className='auto-fighter-div'>
				<div className='battle-fighters-selector'>
					<div className='auto-fighter-table'>
						<table className='battle-fighter-list' cellspacing="0">
							<thead>
								<tr className='battle-fighters-list-header'>
									<td id="fighter-basic-name">Name</td>
									<td id="fighter-basic-attacks">Attacks</td>
									<td id="fighter-basic-hit-bonus">Hit bonus</td>
									<td id="fighter-basic-dice-num">Dices</td>
									<td id="fighter-basic-dice-type">&nbsp;</td>
									<td id="fighter-basic-dmg-bonus">Dmg bonus</td>
									<td id="fighter-basic-adv">Adv</td>
									<td id="fighter-basic-ac-obj">AC objective</td>
									<td id="fighter-basic-button">&nbsp;</td>
								</tr>
							</thead>
							<tbody>
								<tr id="add-new-battle-fighter">
									<td className="battle-fighter-name">
										<select className="name-fighter-selector">

										</select>
									</td>

									<td className="battle-fighter-attacks">
										<input type="number" min="0"></input>
									</td>

									<td className="battle-fighter-hit-bonus">
										<input type="number"></input>
									</td>

									<td className="battle-fighter-dice-number">
										<input type="number"></input>
									</td>

									<td className="battle-fighter-dice-type">
										<select className="dice-type-selector">
											<option value="d4">d4</option>
											<option value="d6">d6</option>
											<option value="d8">d8</option>
											<option value="d10">d10</option>
											<option value="d12">d12</option>
											<option value="d20">d20</option>
											<option value="d100">d100</option>
										</select>
									</td>

									<td className="battle-fighter-dmg-bonus">
										<input type="number"></input>
									</td>

									<td className="battle-fighter-adventage">
										<input className="battle-fighter-adv-check" type="checkbox"></input>
									</td>

									<td className="battle-fighter-armor-objective">
										<input type="number" min="0" max="99"></input>
									</td>

									<td className="battle-fighter-button">
										<button id="add-fighter-button" onClick={AddFighter}>Add fighter</button>
									</td>
								</tr>
							</tbody>
						</table>
						<button onClick={ReadyFighters}>Results</button>
					</div>
				</div>

				<div className='battle-fighters-results'>
					<table id="figh-results-table" cellspacing="0">
						<thead>
							<tr className="results-table-header">
								<td>Name</td>
								<td>Attacks</td>
								<td>Hits</td>
								<td>Misses</td>
								<td>Damage</td>
							</tr>
						</thead>
						<tbody>

							<tr id="auto-fighter-results-bottom"></tr>
						</tbody>
					</table>
				</div>

			</div>
		</div>
		
	</div>
);



function ResetBlur () {
	$(".editable").unbind("blur");
	$(".editable").bind("blur", function() {
		ReinsertIntoCharacterList($(this).closest('.battle-character'));
	});
};

function ResetSelect () {
	$(".name-fighter-selector").unbind("blur");
	$(".name-fighter-selector").bind("blur", function() {
		SelectedNames($(this).val());

	});
	$(document).ready(function() {
		$('.name-fighter-selector').focus(function() {
				names_list_selector.length = 0;
				$('.select-options').remove();
				let names_selector = document.getElementsByClassName("name-selection-td");
				names_list_selector = [].map.call(names_selector, item => "<option class='select-options' value='" + item.textContent + "'>" + item.textContent + "</option>");
				names_list_selector.sort();
				names_list_selector.forEach(insert_name => $(".name-fighter-selector").append(insert_name));
		});
	});

};

ResetBlur();
ResetSelect();

reportWebVitals();


// Auto fighter results and math

function SelectedNames (fightername) {
	selected_names.push(fightername);
};


function ReadyFighters() {
	let f_ids = new Map();
	$(".results-line").remove();
	[...document.getElementsByClassName("battle-fighter")].forEach(
		element => {
			let temporal_name = document.getElementById(element.id).getElementsByClassName("name-fighter-selector")[0].value;
			let temporal_attacks = document.getElementById(element.id).getElementsByClassName("battle-fighter-attacks")[0].innerText;
			let temporal_hit_bonus = document.getElementById(element.id).getElementsByClassName("battle-fighter-hit-bonus")[0].innerText;
			let temporal_dice_number = document.getElementById(element.id).getElementsByClassName("battle-fighter-dice-number")[0].innerText;
			let temporal_dice_type = document.getElementById(element.id).getElementsByClassName("dice-type-selector-dyn")[0].value;
			let temporal_dmg_bonus = document.getElementById(element.id).getElementsByClassName("battle-fighter-dmg-bonus")[0].value;
			let temporal_adventage = document.getElementById(element.id).getElementsByClassName("battle-fighter-adv-check-dyn")[0].checked;
			let temporal_armor_obj = document.getElementById(element.id).getElementsByClassName("battle-fighter-armor-objective")[0].innerText;
			f_ids.set("id", element.id);
			f_ids.set("name", temporal_name);
			f_ids.set("attacks", temporal_attacks);
			f_ids.set("hit_bonus", temporal_hit_bonus);
			f_ids.set("dice_number", temporal_dice_number);
			f_ids.set("dice_type", temporal_dice_type);
			f_ids.set("dmg_bonus", temporal_dmg_bonus);
			f_ids.set("adv", temporal_adventage);
			f_ids.set("armor_obj", temporal_armor_obj);

			let Results = function(name, attacks, hits, misses, damage){
				this.name = name;
				this.attacks = attacks;
				this.hits = hits;
				this.misses = misses;
				this.damage = damage;
			
				this.appendTo = function(target){
					let str = "";
					str += "<tr class='results-line'>";
					str += "<td class='results-name'>" + this.name + "</td>";
					str += "<td class='results-attacks'>" + this.attacks + "</td>";
					str += "<td class='results-hits'>" + this.hits + "</td>";
					str += "<td class='results-misses'>" + this.misses + "</td>";
					str += "<td class='results-damage'>" + this.damage + "</td>";
					str += "</tr>";
					
					$(str).insertBefore($('#auto-fighter-results-bottom'));
				}
			};
			ShowResults();
			function ShowResults() {
				let name = f_ids.get("name");
				let adv = f_ids.get("adv");
				let attacks = f_ids.get("attacks");
				let hits = 0;
				let misses = 0;
				let hit_bonus = f_ids.get("hit_bonus");
				let dmg_bonus = f_ids.get("dmg_bonus");
				if (adv === true) {
					for (let i = attacks; i > 0; i--) {
						let attack_throw1 = Math.floor(Math.random() * 20) + 1;
						let attack_throw2 = Math.floor(Math.random() * 20) + 1;
						let best_attack_throw = attack_throw1 > attack_throw2 ? attack_throw1 : attack_throw2;
						best_attack_throw += hit_bonus;
						if (best_attack_throw >= f_ids.get("armor_obj")) {
							hits += 1;
						} else {
							misses += 1;
						};
					};
				} else {
					for (let i = attacks; i > 0; i--) {
						let attack_throw = Math.floor(Math.random() * 20) + 1 + hit_bonus;
						if (attack_throw >= f_ids.get("armor_obj")) {
							hits += 1;
						} else {
							misses += 1;
						};
					};
				};
				
				let damage_type = 0;
				if (f_ids.get("dice_type") === "d4") {
					damage_type = 4;
				} else if (f_ids.get("dice_type") === "d6") {
					damage_type = 6;
				} else if (f_ids.get("dice_type") === "d8") {
					damage_type = 8;
				} else if (f_ids.get("dice_type") === "d10") {
					damage_type = 10;
				} else if (f_ids.get("dice_type") === "d12") {
					damage_type = 12;
				} else if (f_ids.get("dice_type") === "d20") {
					damage_type = 20;
				} else if (f_ids.get("dice_type") === "d100") {
					damage_type = 100;
				} else {
					damage_type = 6;
				};
				let damage =  hits * damage_type + dmg_bonus;

				let result = new Results(name, attacks, hits, misses, damage);
				result.appendTo('#figh-results-table tbody');
				
			};

		}
	);
};