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

module.exports = {truncate, stripHtml, formatDate, changeStatus};

