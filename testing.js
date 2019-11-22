var myArray = [1, 2, 3, 4, 5];

var index = myArray.indexOf(2);
if (index > -1) {
    myArray.splice(index, 1);
}
console.log(myArray);
