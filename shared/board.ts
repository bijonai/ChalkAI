export interface BoardComponent {
  name: string

}

export interface Board {

}

export function createEmptyBoard(): Board {
  return {
    components: [],
  }
}
