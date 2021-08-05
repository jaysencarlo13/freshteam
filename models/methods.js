exports.FilterArray = (array, field, field2) => {
    let array_ = [];
    if (!field2)
        array.forEach((element) => {
            if (element[field] !== '' && element[field]) array_.push(element[field]);
        });
    else
        array.forEach((element) => {
            if (element[field][field2] !== '' && element[field][field2]) array_.push(element[field][field2]);
        });
    return array_;
};
