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
import {languages} from "./languages.js";
import {constant_default_cfg_obj, GenerateSettingsFile, processSettingsFile} from "./settingsProcessor.js";

let default_obj = structuredClone(constant_default_cfg_obj);

export default {
    data() {
        return {
            selected_lang: languages.zh_CN, configurations: default_obj, selected_file_name: ""
        }
    }, methods: {
        handle_lang(lang_opt) {
            switch (lang_opt) {
                case 0:
                    this.selected_lang = languages.zh_CN;
                    break;
                case 1:
                    this.selected_lang = languages.en_US;
                    break;
            }
        }, reset_row(cfg_name) {
            let vals = this.configurations.sections[0].values[0].values;
            for (let i = 0; i < vals.length; i++) {
                if (cfg_name === vals[i].Name) {
                    this.configurations.sections[0].values[0].values[i].Value = constant_default_cfg_obj.sections[0].values[0].values[i].Value;
                    return;
                }
            }
        }, reset_all(){
            this.configurations = structuredClone(constant_default_cfg_obj);
        }, generate_cfg() {
            let doc = GenerateSettingsFile(this.configurations);
            const blob = new Blob([doc],{type: 'text/plain'});
            // Create an invisible link element
            const element = document.createElement('a');

            // Create a URL for the blob
            const url = URL.createObjectURL(blob);
            element.setAttribute('href', url);

            // Set the download attribute of the link to the filename
            element.setAttribute('download', 'PalWorldSettings.ini');

            // Append the link to the body (it needs to be in the DOM to work)
            document.body.appendChild(element);

            // Simulate a click on the link
            element.click();

            // Clean up: remove the link and revoke the object URL
            document.body.removeChild(element);
            URL.revokeObjectURL(url);

        }, handle_file_drop(event) {
            event.preventDefault();
            const files = event.dataTransfer.files;
            const first_file = files[0];
            this.process_file(first_file);
        }, process_file(file) {
            this.selected_file_name = file.name;
            try {
                let reader = new FileReader();
                reader.readAsText(file);
                reader.onload =  (load_evt) => {
                    this.configurations = processSettingsFile(load_evt.target.result);
                };
            } catch (ex) {
                console.log(ex);
            }
        }
    }
}