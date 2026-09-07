## joining array elements based on delemeter by array.join(" ") method
    const skills = ["c++","py","js"];
    console.log(skills.join(" ")); // c++ py js

## converting text (string) to array based on delemeter using str.split(" ") method
    const skills = ["c++", "py", "js"];
    console.log(skills) // [ 'c++', 'py', 'js' ]
    console.log(skills.join(" ")); // c++ py js
    console.log(skills.join(" ").split(" ")) // [ 'c++', 'py', 'js' ]