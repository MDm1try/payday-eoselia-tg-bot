type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

type SetProperty<T, K extends keyof T> = { [P in K]-?: T[P] }

type Require<T, K extends keyof T> = T & SetProperty<T, K>

type With<T, K extends keyof T> = Omit<T, keyof T> & SetProperty<T, K>
