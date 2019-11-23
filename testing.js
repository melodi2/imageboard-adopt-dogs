var myArray = [5, 4, 3, 2, 1];

var index = myArray.indexOf(2);
if (index > -1) {
    console.log(index);
    myArray.splice(index, 1);
}
console.log(myArray);
