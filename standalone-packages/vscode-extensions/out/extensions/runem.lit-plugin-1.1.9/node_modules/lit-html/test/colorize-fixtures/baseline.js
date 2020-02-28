{ // Should highlight html
    const a = html`<a>`;
    html`<a>`;
    a.html`<a>`;
    a.a.html`<a>`;
    const render = () => html`
<ul>
    ${repeat(items, (i) => i.id, (i, index) => html`
    <li>${index}: ${i.name}</li>`)}
</ul>
`; ƒ
}

{ // Should not highlight html
    const a = ahtml`<a>`;
    const b = Html`<a>`;
    const c = html.a`<a>`;
    const d = 'html`<a>`';
    const e = ' html`<a>` '
    const f = " html`<a>` "

    // html`<a>`
    /* html`<a>` */
}


{ // Should highlight svg
    const a = svg`<a>`;
    svg`<a>`;
    a.svg`<a>`;
    a.a.svg`<a>`;
    const render = () => svg`
  <ul>
    ${repeat(items, (i) => i.id, (i, index) => svg`
    <li>${index}: ${i.name}</li>`)}
  </ul>
`;
}

{ // Should not highlight svg
    const a = asvg`<a>`;
    const b = Svg`<a>`;
    const c = svg.a`<a>`;
    const d = 'svg`<a>`';
    const e = ' svg`<a>` '
    const f = " svg`<a>` "

    // svg`<a>`
    /* svg`<a>` */
}
