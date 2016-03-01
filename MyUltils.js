//utils function


var MyUltils = {
	//IN: time in minute (150)
	//OUT: 2h30
	TimeToString: function (timeInMinute) {
			var h = Math.floor(timeInMinute / 60);
			var minute = timeInMinute - h * 60;
			return h + 'h' + minute;
		},

	//IN: JSON
	//OUT: JSON in format
	FormatJsonString: function(json) {
		    var input = json;
		    var output = "";
		    var tabCounter = 0;

		    for (var i = 0; i < input.length; i++) {
		        var c = input[i];

		        switch (c) {
		            case '[': //xuống dòng +TAB
		            case '{': //xuống dòng +TAB
		                tabCounter++;
		                output += c;
		                output += '\n';
		                for (var j = tabCounter - 1; j >= 0; j--) {
		                    output += '\t';
		                };
		                break;

		            case ',': //xuống dòng =TAB
		                output += c;
		                output += '\n';
		                for (var j = tabCounter - 1; j >= 0; j--) {
		                    output += '\t';
		                };
		                break;

		            case ']': //xuống dòng -TAB
		            case '}': //xuống dòng -TAB
		                tabCounter--;
		                output += '\n';
		                for (var j = tabCounter - 1; j >= 0; j--) {
		                    output += '\t';
		                };
		                output += c;
		                break;

		            default:
		                output += c;
		                break;
		        }
		    };

		    return output;
		}
};
