const isEmpty = (data = []) => {
    if (typeof data === "object")
        if (Array.isArray(data)) return !data.length
        else return !Object.keys(data).length
    return !data;
};


const updatedDate = () => {
    const currentDate = new Date();

    const startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
    );


    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);



    return { startDate, endDate }

}

module.exports = { isEmpty, updatedDate };