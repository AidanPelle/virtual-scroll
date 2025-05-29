/**
 * Handles checking if changes have been made to the data inside of our dataSource, so that we can re-render when necessary.
 * 
 * Since we don't have to care about what changes specifically were made, can stop as soon as we locate a single change.
 */
export class IterableDiffer<T> {
    private previousArray: T[] = [];

    /**
     * @param arrayToCheck the new array to check against.
     * 
     * This differ is significantly simpler than Angular's default due to a less complex use-case,
     * only to tell us when to trigger refresh events in cdk-virtual-scroll-viewport.
     * 
     * @returns if there have been changes to the array or not.
     */
    diff(newArray: T[]): boolean {
        const previousArray = this.previousArray
        this.previousArray = Object.assign([], newArray);;

        if (previousArray.length !== newArray.length)
            return true;


        for (let i = 0; i < previousArray.length; i++) {
            if (previousArray[i] !== newArray[i])
                return true;
        }
        return false;
    }
}