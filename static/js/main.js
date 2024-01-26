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

import { createApp } from "./vue.esm-browser.js";
import { languages } from "./languages.js"
import { constant_default_settings_text } from "./constants.js";
import { processSettingsFile } from "./settingsProcessor.js";

