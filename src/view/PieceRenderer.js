export const getPieceContent = (type, color) => {
    const isWhite = color === 'w';
    // Using high quality SVG paths for standard pieces

    // Fill colors
    const fill = isWhite ? '#fff' : '#000';
    const stroke = isWhite ? '#000' : '#fff';

    const paths = {
        'p': isWhite ?
            `<path d="M22 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21h12c0-2.41-1.33-4.5-2.78-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" stroke="${stroke}" fill="${fill}"/>` :
            `<path d="M22 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21h12c0-2.41-1.33-4.5-2.78-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" stroke="${stroke}" fill="${fill}" />`,
        // Note: simple placeholder paths for now? No, I should use real SVG data if possible. 
        // Better strategy: Use Unicode characters with a nice font size and shadow. It actually looks very clean on modern systems.
        // If I want "Premium", I can style them with CSS text-shadow.
    };

    // Let's use Unicode for now as "Standard Chess Rules" implies standard look. 
    // And to make it premium, we use a nice font and effects.

    const mapping = {
        'k': isWhite ? '♔' : '♚',
        'q': isWhite ? '♕' : '♛',
        'r': isWhite ? '♖' : '♜',
        'b': isWhite ? '♗' : '♝',
        'n': isWhite ? '♘' : '♞',
        'p': isWhite ? '♙' : '♟'
    };

    return `<div class="piece ${isWhite ? 'white' : 'black'}">${mapping[type]}</div>`;
}
