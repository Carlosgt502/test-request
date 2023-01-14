async function getToken() {
  let localExpires = localStorage.getItem('expires');
  let USER_AGENT = 'Kamyroll/4.1.0 Android/7.1.2 okhttp/4.9.2';

  if (localExpires == null || localExpires < Date.now()) {
    console.log('[CR Premium] Token expirado, gerando novo token...');
    let data = {
      'device_id': 'iframeplayerdev',
      'device_type': 'dev4m.iframe.player',
      'access_token': 'HMbQeThWmZq4t7w'
    };
    let url = new URL('https://api.kamyroll.tech/auth/v1/token');
    url.search = new URLSearchParams(data);

    let response = await axios(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
        'user-agent': USER_AGENT
      },
      params: data
    });
    let token = JSON.parse(response)['access_token'];
    let expires = parseInt(JSON.parse(response)['expires_in']);
    localStorage.setItem('token', token);
    localStorage.setItem('expires', Date.now() + expires);
  }
}

async function getData(video_id) {
  let USER_AGENT = 'Kamyroll/4.1.0 Android/7.1.2 okhttp/4.9.2';
  for (let i = 0; i < 2; i++) {
    await getToken();
    let localToken = localStorage.getItem('token');

    let response_media = await axios('https://api.kamyroll.tech/videos/v1/streams?channel_id=crunchyroll&id=' + video_id + '&locale=pt-BR', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localToken,
        'accept': '*/*',
        'user-agent': USER_AGENT
      }
    });
    if (response_media.includes('error')) {
      localStorage.removeItem('expires');
      continue;
    }

    return response_media;
  }
  console.log('[CR Premium] Erro ao pegar dados da stream...');
}

(async () => {
  const media = await getData('GEVUZM77');

  console.log(media)
})();
