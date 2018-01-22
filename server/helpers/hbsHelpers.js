const moment = require('moment');

const truncate = (str, len) => {
   if (str.length > len && str.length > 0) {
      // Create New String of Specified length
      const newStr = str.substr(0, len + 1);
      // Adjust length to end on a complete word
      if (newStr.lastIndexOf(' ') === -1 || newStr.lastIndexOf(' ') === len) {
         return str.substr(0, len) + '...';
      } else {
         return newStr.substring(0, newStr.lastIndexOf(' ')) + '...';
      }
   }
   return str
}

const stripHtml = (input) => {
   // return input.replace(/<(?:.|\n)*?>/gm, '');
   return input.replace(/<[^>]+>/g, '');
}

const formatDate = (date, format) => {
   return moment(date).format(format);
}

const changeStatus = (status) => {
   if(status === 'public') {
      return 'Make Private'
   } else {
      return 'Make Public'
   }
}

const select = function (value, options) {
   return options.fn()
    // splits the surrounded block at each line break (in this case each 'option' is an array item)
      .split('\n')
      .map(function (v) {
         // creates string with the 'value' argument inserted  
         var t = 'value="' + value + '"';
         // Uses RegEx to see if the new string is found in each array item
         // In this case if the original 'option' value matches the newly created one base on the value of the argument passed in.
         return RegExp(t).test(v) ? v.replace(t, t + ' selected="selected"') : v;
      })
      .join('\n');
}

const comments = (allowComments) => {
   if(allowComments) {
      return 'checked'
   }
}

const isOwner = (id) => {
  if(id === req.user.id) {
    return true;
  }
  return false;
}

module.exports = {truncate, stripHtml, formatDate, changeStatus, select, comments, isOwner};

