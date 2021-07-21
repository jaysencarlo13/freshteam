import React, { useEffect, useState } from 'react';
import Contents from '../container/Contents';
import './personal-info.css';
import PersonalInfo from './PersonalInfo';
import WorkInfo from './WorkInfo';
import axios from 'axios';

export default function ViewAccount() {
  const [userData, setUserData] = useState(null);
  const data = JSON.parse(localStorage.getItem('data'));
  useEffect(() => {
    if (!userData)
      axios
        .post('/api/user', data)
        .then((res) => {
          setUserData(res.data.user);
        })
        .catch((err) => {
          console.log(err.response);
        });
  });

  return (
    <Contents>
      <div className="container personal-info">
        <div className="row">
          <PersonalInfo data={userData} />
          <WorkInfo data={userData} />
        </div>
      </div>
    </Contents>
  );
}
