export class NoInjuriesComponent {
    getElement() {
        const noInjuriesDiv = document.createElement('div');
        const inner = document.createElement('p');
        inner.textContent = "You have no saved injuries. Use the button above to get started or go and kick some butt, you machine!";
        noInjuriesDiv.appendChild(inner);
        return noInjuriesDiv;
    }
}