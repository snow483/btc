const fetch = require('node-fetch');

// FRED API의 기본 URL
const FRED_API_URL = 'https://api.stlouisfed.org/fred/series/observations';

exports.handler = async function(event, context) {
  try {
    // API 키를 환경 변수에서 가져오기
    const apiKey = process.env.FRED_API_KEY;
    const seriesId = event.queryStringParameters.seriesId || 'GS10'; // 예시: DGS10, GS10 등
    const startDate = event.queryStringParameters.startDate || '2014-01-01'; // 기본 시작 날짜
    const endDate = event.queryStringParameters.endDate || new Date().toISOString().split('T')[0]; // 오늘 날짜로 기본 설정

    // API 호출 URL 구성
    const apiUrl = `${FRED_API_URL}?series_id=${seriesId}&api_key=${apiKey}&file_type=json&start_date=${startDate}&end_date=${endDate}`;

    // FRED API 호출
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch data from FRED API');
    }
    const data = await response.json();

    // CORS 해결: 헤더에 CORS 허용 추가
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',  // 모든 출처 허용
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error fetching FRED data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};