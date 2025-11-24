import React, { useEffect } from 'react';
import usersApi from '../../utils/UsersApi';

const YandexOath = (setIsLoggedIn) => {
  useEffect(() => {
    
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1)); // Remove the '#' and parse
      const accessToken = params.get('access_token');
      if (accessToken) {
        fetch('https://login.yandex.ru/info?format=json', {
          method: 'GET',
          headers: {
            'Authorization': `OAuth ${accessToken}`,
            'Content-Type': 'application/json'
          }
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            return response.json();
          })
          .then(data => {
            usersApi.yandexOauth(data.real_name, data.default_email, data.default_phone.number, accessToken, data.id)
            .then(response => {
              setTimeout(() => {
                window.close();
              }, 100);
            })
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }

    }

    }, []);

  return (
    <div style={{ height: '500px' }}>
      <h2>Подождите, происходит авторизация...</h2>
    </div>
  );
};

export default YandexOath;