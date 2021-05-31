const defaultState = {
    employees: []
}

export const listReducer = (state = defaultState, action) => {
	switch (action.type) {
		case 'LOAD_EMPLOYEES':
			return {...state, employees: [...state.employees, ...action.payload.map(employee => { 
				return {...employee, active: 'not active'}})]}
		case 'CHECKED_ON':
			return {...state, employees: [...state.employees.map(employee => {
				return employee === action.payload ? {...employee, active: 'active'} : employee})]}
		case 'CHECKED_OFF': 
			return {...state, employees: [...state.employees.map(employee => {
				return employee === action.payload ? {...employee, active: 'not active'} : employee})]}			
		default:
			return state
	}
}
