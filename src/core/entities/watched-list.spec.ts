import { WatchedList } from './watched-list'

class NumberWatchedList extends WatchedList<number> {
  public compareItems(a: number, b: number): boolean {
    return a === b
  }
}

describe('Watched List', () => {
  it('should create a watched list with initial items', () => {
    const list = new NumberWatchedList([1, 2, 3])
    expect(list.currentItems).toHaveLength(3)
  })

  it('should able to remove items from the list', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.remove(2)

    expect(list.currentItems).toHaveLength(2)
    expect(list.getRemovedItems()).toEqual([2])
  })

  it('should able to add an item even if it was removed before', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.remove(2)
    list.add(2)

    expect(list.currentItems).toHaveLength(3)

    expect(list.getRemovedItems()).toEqual([])
    expect(list.getNewItems()).toEqual([])
  })

  it('should able to update watched list items', () => {
    const list = new NumberWatchedList([1, 2, 3])

    list.update([1, 3, 5])

    expect(list.getRemovedItems()).toEqual([2])
    expect(list.getNewItems()).toEqual([5])
  })
})
