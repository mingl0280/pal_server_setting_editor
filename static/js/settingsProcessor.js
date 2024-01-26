/*
	PMX: Palworld server settings editor 
    Copyright (C) 2024  Pmx

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
import {constant_default_settings_text, death_penalty_opts} from "./constants.js";

export function processSettingsFile(iniContent) {
    const result = {sections: []};
    const lines = iniContent.split('\n').filter(line => line.trim());

    lines.forEach(line => {
        if (line.startsWith(';')) {
            return
        }
        if (line.startsWith('[')) {
            const sectionName = line.match(/\[(.*?)\]/)[1];
            result.sections.push({section_name: sectionName, values: []});
        } else {
            const lastSection = result.sections[result.sections.length - 1];
            let settingName = "", settingValues = "", tmpstr = "";
            let is_in_value = false;
            for (let i = 0; i < line.length; i++) {
                if (line[i] === '=' && !is_in_value) {
                    settingName = tmpstr;
                    tmpstr = "";
                    is_in_value = true;
                } else {
                    tmpstr += line[i];
                }
            }
            settingValues = tmpstr;

            if (settingValues) {
                if (settingValues.startsWith('('))
                    settingValues = settingValues.slice(1, -1);
                const settingsArray = settingValues.split(',').filter(setting => setting.trim());
                const parsedSettings = settingsArray.map(setting => {
                    let [name, value] = setting.split('=');

                    console.log("Name: " + name + ", value: " + value);

                    let data_type = "string";
                    let enabled = true;
                    let possible_opts = [];
                    if (value !== undefined) {
                        if (!isNaN(value) && value.toString().indexOf('.') !== -1) {
                            data_type = 'float';
                        }
                        if (value.trim() === 'True' || value.trim() === 'False') {
                            data_type = 'bool';
                            possible_opts = ["True", "False"]
                        }
                        if (/^-?\d+$/.test(value)) {
                            data_type = 'int';
                        }
                    }
                    if (name.trim() === "Difficulty") {
                        enabled = false;
                        data_type = 'options';
                    }
                    if (name.trim() === "DeathPenalty")
                        possible_opts = death_penalty_opts;

                    if (possible_opts.length > 0 && data_type !== 'bool')
                        data_type = 'options';
                    if (data_type === 'string') {
                        if (value.startsWith('"'))
                            value = value.slice(1);
                        if (value.endsWith('"'))
                            value = value.slice(0, -1);
                    }
                    return {
                        Name: name.trim(),
                        Type: data_type, // (value === undefined || isNaN(value) || value.trim() === 'True' || value.trim() === 'False') ? 'string' : is_float ? 'float' : 'int',
                        Value: (value === undefined) ? '#None#' :
                            data_type === 'string' ? value :
                                data_type === 'float' ? parseFloat(value) :
                                    data_type === 'int' ? parseInt(value) :
                                        data_type === 'bool' ? (value.trim() !== "False") :
                                            value
                        ,
                        PossibleOptions: possible_opts,
                        Disabled: !enabled
                    };
                });
                lastSection.values.push({setting_name: settingName.trim(), values: parsedSettings});
            } else {
                lastSection.values.push({setting_name: settingName.trim(), values: []});
            }
        }
    });
    return result;
}

export const constant_default_cfg_obj = processSettingsFile(constant_default_settings_text);

export function GenerateSettingsFile(obj) {
    return obj.sections.map(section => {
        return `[${section.section_name}]\n` + section.values.map(setting => {
            if (setting.values.length === 0) {
                return `${setting.setting_name}=()`;
            }
            const settingValues = setting.values.map(value => {
                return `${value.Name}=${
                    value.Value === '#None#' ? '' :
                        value.Type === 'string' ? '"' + value.Value + '"' :
                            value.Type === 'options' ? value.Value :
                                value.Type === 'int' ? value.Value :
                                    value.Type === 'bool' ? (value.Value === false ? "False" : "True") :
                                        value.Value.toFixed(6)
                }`;
            }).join(',');
            return `${setting.setting_name}=(${settingValues})`;
        }).join('\n');
    }).join('\n');
}
