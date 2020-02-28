html`
    <h2 .title=${ 1 + 1 }></h2>
    <input .value=${ 1 + 1 } @input=${e => console.log(e)}>
`;