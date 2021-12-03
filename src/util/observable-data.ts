import {BehaviorSubject, Observable} from 'rxjs'
import {filter, first} from 'rxjs/operators'

interface Params<T> {
	/**
	 * Initial value
	 */
	initialValue?: T

	/**
	 * whether to emit null values
	 */
	nullable?: boolean
}

/**
 * Object wrapper for reactive use. Set object value with `set()` method. Subscribe to it's value using `observable`
 * field
 */
export class ObservableData<T> {

	/**
	 * ReactiveX `Subject` of an object
	 */
	private subject: BehaviorSubject<T>

	/**
	 * Observable of object. Used to share object state. Emits each time the `set()` method is called
	 */
	observable: Observable<T>

	/**
	 * Construct new ObservableData instance. Initial value is null if not provided. If nullable is false, any null value
	 * will not be emitted
	 */
	constructor(params?: Params<T>) {
		this.subject = new BehaviorSubject<T>(params?.initialValue || null as any)
		this.observable = params?.nullable || false
			? this.subject.asObservable()
			: this.subject.asObservable().pipe(filter(v => v !== null))
	}

	/**
	 * Used to set new object's value. Each time it's set - new event is emitted from `observable` field
	 * @param value
	 */
	set(value: T) {
		this.subject.next(value)
	}

	/**
	 * Resend last emitted value
	 */
	update(map?: (value: T) => T): void {
		this.observable
			.pipe(first())
			.subscribe(value => {
				this.subject.next(map ? map(value) : value)
			})
	}

}
