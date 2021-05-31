import React, { useState, useEffect } from 'react'; 
import {  useDispatch, useSelector } from 'react-redux';
import Header from './components/header';
import './App.css';

const App = () => {
  const dispatch = useDispatch()
  const employees = useSelector(state => state.list.employees)
  const fetchList = () => {
    return (dispatch) => {
		  fetch('https://yalantis-react-school-api.yalantis.com/api/task0/users')
			  .then(response => response.json())
			  .then(json => dispatch({type: 'LOAD_EMPLOYEES', payload: json}))
     }
  }
  
  useEffect(() => {
    dispatch(fetchList())
  }, [dispatch])
  
  employees.sort((a, b) => a.lastName.localeCompare(b.lastName))
  
  let i = 64;
  let j = 0;
  let arr = [];
  let date = new Date()
  let currentMonth = date.getMonth()
  let monthList = []
  let birthday = [];
  for (let i = 0; i < 12; i++) {
    birthday[i] = [] 
  }
  for (let elem of employees) {
    let letter = elem.lastName.charCodeAt(0);
    if (letter === i) {
      arr[j - 1].push(elem)
    } else { 
      if (letter > i) { 
        for (let k = i + 1; k < letter; k++) {
          arr[j] = [String.fromCharCode(k)]
          j++;
        }
        i += (letter - i);
        arr[j] = [String.fromCharCode(i)];
        arr[j].push(elem)
        j++;
      }
    } 
    if (elem.active === 'active') {
      let dobForm = elem.dob.slice(0, 10).split('-')
      let numMonth = dobForm[1] - 1
      let dobMonth
    if (elem.dob.slice(8, 10) === '30' && Number(elem.dob.slice(11, 13)) > 20) {
        dobMonth = new Date(elem.dob.slice(0, 11) + '20' + elem.dob.slice(13)).toLocaleString('en', {month: 'long'})
      } else {
        dobMonth = new Date(elem.dob).toLocaleString('en', {month: 'long'})
      }
      dobForm[1] = dobMonth + ','
      dobForm = dobForm.reverse().join(' ')
      let index = numMonth - currentMonth >= 0 ? numMonth - currentMonth : numMonth - currentMonth + 12
      monthList[index] = dobMonth 
      birthday[index].push([elem.id, elem.lastName, ' ', elem.firstName,' - ', dobForm, ' year'])
    }
  }

  if (arr.length) {
    let len = arr[arr.length - 1][0].charCodeAt(0);
    if (len < 90 ) {
      for (let i = len + 1; i <= 90; i++){
        arr[j] = [String.fromCharCode(i)]
        j++;
      }
    } 
  } 
  
  let counter = -1
  const birthdayList = birthday.map(elem => {
    counter++
    return  <ul key={counter} className="ul-style"> 
      {monthList[counter]}
      {elem.map(item => {
        return <li key={item.slice(0, 1)} className="li-style">
          {item.slice(1)}
        </li>
      })}
    </ul>
  })
  
  const RadioButton = ({ props }) => { 
    const dispatch = useDispatch()
    const [checked, setChecked] = useState(props.active)
         
    return (
      <div>
        <label>
          <input 
            type="radio"  
            name={props.id} 
            checked={checked === 'not active'}
            onChange={() => setChecked(dispatch({type: 'CHECKED_OFF', payload: props}))}
          /> not active
        </label>
        <br />
        <label>
          <input 
            type="radio"  
            name={props.id} 
            checked={checked === 'active'}
            onChange={() => setChecked(dispatch({type: 'CHECKED_ON', payload: props}))}
          /> active
        </label>
      </div>
    )
  }
         
  const employeesOutput = arr.map(elem => {
    return <section className="wrapper-left" key={elem[0].charCodeAt(0)}>
      <div className="letter">
        {elem[0]}
      </div>
      <div className="empty">
        {elem.slice(1).length === 0 ? '-----' : ''}
      </div>
      {elem.slice(1).map(employee => {
        return <div className="elem" key={employee.id}>
          <div className="last-first-name" >
            <div style={{color: `${employee.active === 'active' ? 'blue' : 'black'}`}}>
              {employee.lastName} {employee.firstName}
            </div>
          </div>
          <div className="radio">
            <RadioButton props={employee} />
          </div>     
        </div>
      })} 
    </section> 
  });

  return (
    <div>
      <Header />
      <div className="elems">
        <div className="elems-left">
          {employeesOutput}
        </div> 
        {employees.some(elem => elem.active === 'active') ? 
          <div className="elems-right"> 
            {birthdayList} 
          </div> 
          :
          <div className="elems-right padd">
            Employeers list is empty
          </div>
        }     
       </div>  
    </div>      
  );
}

export default App;