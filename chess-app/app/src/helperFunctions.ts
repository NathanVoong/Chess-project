//bug - add error for invalid types
function validPosition(position: [number, number]): boolean {

    const [file, rank] = position

    if (file <= 0 || rank <= 0 || file > 8 || rank > 8) {
        return false
    } else {
        return true
    }

}

export {
    validPosition
};
//console.log(validPosition([1,1]))
