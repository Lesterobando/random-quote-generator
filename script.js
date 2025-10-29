// Dom refences 
const dataOutput = document.getElementById("dataoutput");
const quoteElement = document.getElementById("quote");
const authorElement = document.getElementById("author");
const newQuoteButton = document.getElementById("new-quote");
const copyQuoteButton = document.getElementById("copy-quote");
const thankYouMessage = document.getElementById("thank-you");


//  Fallback quotes
const fallbackquotes = [ 
    { text: "Your attitude, not your aptitude, will determine your altitude.", author: "Zig Ziglar" },
    { text: "The will of man is his happiness.", author: "Friedrich Schiller" },
    { text: "Freedom is the right to tell people what they do not want to hear.", author: "George Orwell" },
    { text: "Strength and growth come only through continuous effort and struggle.", author: "Napoleon Hill" },
    { text: "There are all kinds of stupid people that annoy me but what annoys me most is a lazy argument.", author: "Christopher Hitchens" },
];

// track last displayed quote 
let lastIndex = -1;
// start with fallback attempt
let quotes = fallbackquotes.slice();

//  Function to display random quote and not repeating
function getRandomIndex(){
    let index;
    do {
        index = Math.floor(Math.random() * quotes.length);
    } while (index === lastIndex && quotes.length > 1);
    lastIndex = index;
    return index;
}

// Function to display random quote
function displayQuote() {
    const index = getRandomIndex();
    const quote = quotes[index];
// Remove the show class first to reset fade
    quoteElement.classList.remove("show");
    authorElement.classList.remove("show");
// Timeout to trigger fade in
setTimeout(() => {
    quoteElement.textContent = `"${quote.text}"`;
    authorElement.textContent = `${quote.author}`;
    // Add show class to fade in
    quoteElement.classList.add("show");
    authorElement.classList.add("show");
}, 100);
// hide thank you message when quote appears
    thankYouMessage.style.display = "none"; 

}

// Function to copy quote to clipboard
function copyQuote() {
    const textToCopy = `${quoteElement.textContent} ${authorElement.textContent}`;
    navigator.clipboard.writeText(textToCopy)
    .then(() => {
        thankYouMessage.style.display = "block";
        setTimeout(() => {
            thankYouMessage.style.display = "none";
// hides message after 2 seconds
        }, 2000);
    })
    .catch(err => {
        console.error("Failed to copy: ", err);
    });

}
// Event listeners 
newQuoteButton.addEventListener("click", displayQuote);
copyQuoteButton.addEventListener("click", copyQuote);

// Asynchronous Function to fetch the data
async function getData() {
// Await the response from the API
try {
    const response = await fetch('https://dummyjson.com/quotes');
    // Wait on the response and convert into JSON upon receving it
    const apiData = await response.json();
    // If API returned results. use them instead of fallback
    if (apiData && apiData.quotes?.length > 0) {
        quotes = apiData.quotes.map(q => ({ text: q.quote, author: q.author }));
    }

    console.log("API response:", quotes);
    // Once received return the API data
    return apiData;
} catch (error) {
    console.error("Failed to fetch API, using fallback quotes", error);
    return null;
}
}

// Load quotes when DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
    await getData();
    displayQuote();

});
