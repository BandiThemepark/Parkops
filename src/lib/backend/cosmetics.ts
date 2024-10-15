import fetchData from "../network.ts";

const getAllCosmetics = async (query: string, type: string | undefined) => {
    const [data, error] = await fetchData(
        "get",
        "https://api.bandithemepark.net/cosmetics?limit=1000&q=" + query + (type ? "&type=" + type : ""),
        {}
    );

    console.log(data, error);
    if (error) {
        return [null, error];
    }

    return [data, null];
};

export { getAllCosmetics };