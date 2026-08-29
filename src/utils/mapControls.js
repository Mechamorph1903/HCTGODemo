// A mapbox-gl custom control that re-frames the map on a set of bounds.
// Takes a getter rather than a fixed value because bounds are almost always
// derived from data that loads after the map is constructed — reading at click
// time means the control never closes over a stale (or empty) dataset.
export class FitBoundsControl {
    constructor(getBounds, { padding = 40, title = 'Reset view' } = {}) {
        this._getBounds = getBounds
        this._padding = padding
        this._title = title
    }

    onAdd(map) {
        this._map = map
        this._container = document.createElement('div')
        this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group'

        const button = document.createElement('button')
        button.type = 'button'
        button.title = this._title
        button.setAttribute('aria-label', this._title)
        button.style.display = 'flex'
        button.style.alignItems = 'center'
        button.style.justifyContent = 'center'
        button.innerHTML =
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
            'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>' +
            '</svg>'

        button.addEventListener('click', () => {
            const bounds = this._getBounds()
            if (bounds) this._map.fitBounds(bounds, { padding: this._padding })
        })

        this._container.appendChild(button)
        return this._container
    }

    onRemove() {
        this._container?.parentNode?.removeChild(this._container)
        this._map = undefined
    }
}
