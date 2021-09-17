
const numberedAlphabetMap = {
    1: 'a',
    2: 'b',
    3: 'c',
    4: 'd',
    5: 'e',
    6: 'f',
    7: 'g',
    8: 'h',
    9: 'i',
    10: 'j',
    11: 'k',
    12: 'l',
    13: 'm',
    14: 'n',
    15: 'o',
    16: 'p',
    17: 'q',
    18: 'r',
    19: 's',
    20: 't',
    21: 'u',
    22: 'v',
    23: 'w',
    24: 'x',
    25: 'y',
    26: 'z'
};

// Create an object that has the key/value flipped. Letter as the key and numerical position as the value
const alphabetNumberMap = Object.fromEntries(
    Object.entries(numberedAlphabetMap)
    .map(([num, letter]) => [letter, num])
);

const changePage = direction => {
    // Change the page either moving on to the next image
    // or going back to the previous image.
    // Capture the string unique to the image. Ex: ab1234, zq1337
    const currentImageSlug = window.location.href.split('/')[3];

    // We need the character portion of the unique slug for later, we may need to "increment" it
    let chars = currentImageSlug.split(/\d+/)[0];

    // Get just the "numeric" portion of the unique slug, we need to mutate this depending on our direction. Still a string here
    let currentSlugNumber = currentImageSlug.split(/[a-z]/)[2];

    // Create a real integer we can actually increment or decrement
    currentSlugNumber = Number(currentSlugNumber);

    // @TODO if the Number() instantiation fails, we should gracefully fail

    // Does the user wish to see the last image or are we sallying forth?
    const requestedPreviousImage = direction === 'back';
    const requestedNextImage = direction === 'forward';

    // Create the numeric portion of our new unique slug
    let numberToRequest = requestedPreviousImage ? (currentSlugNumber - 1) : (currentSlugNumber + 1)
    const resetNumber = numberToRequest === -1 && requestedPreviousImage;
    const mutateSlugChars = numberToRequest === 10000 && requestedNextImage;

    if (resetNumber) {
        // We're currently at 0000, the previous number should be 9999
        numberToRequest = 9999;
    }

    if (mutateSlugChars) {
        // We know 10,000 is invalid, reset
        numberToRequest = 0;
        // We've reached the final numerical number in the sequence, 9999. We need to change the slug characters
        const [firstLetter, secondLetter] = chars.split('');
        // If our second letter is a z, we've reached the end of our space and need to try moving the firstLetter
        // forward by one and reset our secondLetter. Ex: az -> ba
        const mutateFirstLetter = secondLetter === 'z';

        if (mutateFirstLetter) {
            const firstLetterMaxed = firstLetter === 'z';

            // Reaching this means our chars are 'zz' and there's nothing to do, fail
            if (firstLetterMaxed) {
            } else {
                const currentLetterPosition = Number(alphabetNumberMap[firstLetter]);
                const nextLetter = numberedAlphabetMap[currentLetterPosition + 1];
                chars = `${nextLetter}a`;
            }
        } else {
            const currentLetterPosition = Number(alphabetNumberMap[secondLetter]);
            const nextLetter = numberedAlphabetMap[currentLetterPosition + 1];
            chars = `${firstLetter}${nextLetter}`;
        }
    }

    slugNumberToRequest = numberToRequest.toString().padStart(4, '0');

    // Smash together our character portion and new number to get the next slug to request
    const nextImageSlug = `${chars}${slugNumberToRequest}`;
    window.location = nextImageSlug;
};

const insertPageControlElements = _ => {
    const controlsDiv = document.createElement('div');
    const targetDiv = document.querySelector('.header');
    const nextPageDiv = document.createElement('div');
    const nextPage = document.createTextNode('>');
    const prevPage = document.createTextNode('<');
    const prevPageDiv = document.createElement('div');

    controlsDiv.id = 'libre-controls';
    controlsDiv.classList.add('libre-controls-wrapper')
    nextPageDiv.id = 'libre-next-page';
    prevPageDiv.id = 'libre-prev-page';

    nextPageDiv.appendChild(nextPage);
    prevPageDiv.appendChild(prevPage);
    controlsDiv.appendChild(prevPageDiv);
    controlsDiv.appendChild(nextPageDiv);
    targetDiv.appendChild(controlsDiv);

    nextPageDiv.addEventListener('click', _ => changePage('forward'));
    prevPageDiv.addEventListener('click', _ => changePage('back'));
};

// This seems a little IIFE if you know what I mean...
(function () {
    insertPageControlElements();
})();