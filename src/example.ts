import { Result } from "./Result";

//Underyling logic
type BackendDataType = { name: string, money: number };
const loadDataFromBackendAsync = () => new Promise<BackendDataType>((resolve, reject) => {
    console.log("Loading data from backend...");
    resolve({ name: "John", money: 15 });
});
const purchaseAsync = (name: string) => new Promise((resolve, reject) => {
    console.log(`Starting purchasing process for ${name}...`);
    resolve("Successfully purchased!");
});
const toggleLoader = (visible: boolean) => {
    console.log(`Loader visible: ${visible}`);
}

//Asynchonous logic (chained method calls)
toggleLoader(true);
Result
    .FromPromise(loadDataFromBackendAsync())
    .onSuccessExecute(data => console.log("Loaded from backend data", data))
    .delay(3000)
    .ensure(data => data.money > 10, "Not enough money")
    .onFailure(error => console.error(error))
    .onSuccess(data => purchaseAsync(data.name))
    .delay(3000)
    .onBoth(() => toggleLoader(false))
    //and so on...
    //.onFailure(error => );
    //.onSuccess(() => redirectToPage("/home")))
    .run();

