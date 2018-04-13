global.fetch = jasmine.createSpy();
const JwtVerifier = require('../');

const standardKey = {
  alg: 'RS256',
  e: 'AQAB',
  kid: 'test-id',
  kty: 'RSA',
  n: '3ZWrUY0Y6IKN1qI4BhxR2C7oHVFgGPYkd38uGq1jQNSqEvJFcN93CYm16_G78FAFKWqwsJb3Wx-nbxDn6LtP4AhULB1H0K0g7_jLklDAHvI8yhOKlvoyvsUFPWtNxlJyh5JJXvkNKV_4Oo12e69f8QCuQ6NpEPl-cSvXIqUYBCs',
  use: 'sig'
};

const standardClaims = {
  ver: 1,
  jti: 'AT.rYtI8Rg2_qtW81NhxN4nXfY0t9HbNaxRpCzs_z4A5uI',
  iss: 'https://dev-171377.oktapreview.com/oauth2/browsertron',
  aud: 'browsertron',
  iat: 0,
  exp: 9999999999,
  cid: '0oaec13ug2Io7NHAA0h7',
  uid: '00ubxveg23HitjTum0h7',
  scp: [
    'openid',
    'api_token'
  ],
  sub: 'test@example.com',
  api_token: true
};

const expiredClaims = Object.assign({}, standardClaims, { exp: 1 });

const standardToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtaWQifQ.eyJ2ZXIiOjEsImp0aSI6IkFULnJZdEk4UmcyX3F0VzgxTmh4TjRuWGZZMHQ5SGJOYXhScEN6c196NEE1dUkiLCJpc3MiOiJodHRwczovL2Rldi0xNzEzNzcub2t0YXByZXZpZXcuY29tL29hdXRoMi9icm93c2VydHJvbiIsImF1ZCI6ImJyb3dzZXJ0cm9uIiwiaWF0IjowLCJleHAiOjk5OTk5OTk5OTksImNpZCI6IjBvYWVjMTN1ZzJJbzdOSEFBMGg3IiwidWlkIjoiMDB1Ynh2ZWcyM0hpdGpUdW0waDciLCJzY3AiOlsib3BlbmlkIiwiYXBpX3Rva2VuIl0sInN1YiI6InRlc3RAZXhhbXBsZS5jb20iLCJhcGlfdG9rZW4iOnRydWV9.b6Z__vsbr_EaEW9dYu7oM4d1Za0zjbXZilUnvfaaQqauVM81DcszmA7bZJgWSmflAZSynPhwz3LXEamP6tArNqMXYQJ8xO_uyeD4UvDfdNysIYcczg4rWOaoaajGfVlsbaTDjOOKJK1UZTEkFmoIGPfRNtrU2W9GoaKbQirq-Xg';
const expiredToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRlc3QtaWQifQ.eyJ2ZXIiOjEsImp0aSI6IkFULnJZdEk4UmcyX3F0VzgxTmh4TjRuWGZZMHQ5SGJOYXhScEN6c196NEE1dUkiLCJpc3MiOiJodHRwczovL2Rldi0xNzEzNzcub2t0YXByZXZpZXcuY29tL29hdXRoMi9icm93c2VydHJvbiIsImF1ZCI6ImJyb3dzZXJ0cm9uIiwiaWF0IjowLCJleHAiOjEsImNpZCI6IjBvYWVjMTN1ZzJJbzdOSEFBMGg3IiwidWlkIjoiMDB1Ynh2ZWcyM0hpdGpUdW0waDciLCJzY3AiOlsib3BlbmlkIiwiYXBpX3Rva2VuIl0sInN1YiI6InRlc3RAZXhhbXBsZS5jb20iLCJhcGlfdG9rZW4iOnRydWV9.BXlf72uGwGdmn8VvzW7x8I42aZeZxXbeH5-XLYQT_yziIPfNuDedLhmJd4beUt0ak2n_LfTl6fZ7MWwcorbFKUseMOq4Yg0UdjBsBBQiInd8toNTh2ugEfIfBLF1JiHVBMnIca9L1KrXJkKPqnHVde4R0c2yDSQPat2_lkXPNBM';

fetch.and.callFake(url => {
  const wellKnownUrl = 'https://www.example.com/.well-known/openid-configuration';
  const jwksUrl = 'https://www.example.com/jwks';

  if (url === wellKnownUrl) {
    return Promise.resolve({
      json() {
        return { jwks_uri: jwksUrl };
      }
    });
  }

  if (url === jwksUrl) {
    return Promise.resolve({
      json() {
        return { keys: [standardKey] };
      }
    });
  }

  throw new Error(`Expected ${url} to be ${wellKnownUrl} or ${jwksUrl}`);
});

describe('constructor', () => {
  it('throws if keys or an issuer are not passed', () => {
    expect(() => new JwtVerifier())
      .toThrow(new Error('Must provide an issuer or keys'));
  });
  it('sets maxKeysLifespan to Infinity if keys are provided', () => {
    const verifier = new JwtVerifier({ keys: {} });
    expect(verifier.maxKeysLifespan).toEqual(Infinity);
  });
  it('default maxKeysLifespan and minKeysLifespan', () => {
    const verifier = new JwtVerifier({
      issuer: 'https://example.com'
    });
    expect(verifier.minKeysLifespan).toEqual(60000);
    expect(verifier.maxKeysLifespan).toEqual(900000);
  });
  it('allows overriding maxKeysLifespan and minKeysLifespan', () => {
    const verifier = new JwtVerifier({
      issuer: 'https://example.com',
      minKeysLifespan: 1000,
      maxKeysLifespan: 2000
    });
    expect(verifier.minKeysLifespan).toEqual(1000);
    expect(verifier.maxKeysLifespan).toEqual(2000);
  });
});

describe('verify', () => {
  it('passes on valid token with keys', async () => {
    const verifier = new JwtVerifier({
      keys: [standardKey]
    });
    expect(await verifier.verify(standardToken)).toEqual(standardClaims);
  });
  it('passes on valid token with issuer', async () => {
    const verifier = new JwtVerifier({
      issuer: 'https://www.example.com'
    });
    expect(await verifier.verify(standardToken)).toEqual(standardClaims);
  });
  it('fails on invalid token', async () => {
    const verifier = new JwtVerifier({
      keys: [standardKey]
    });
    let err;
    try {
      await verifier.verify('');
    } catch (e) {
      err = e;
    } finally {
      expect(err).toEqual(new Error('token must have 3 parts'));
    }
  });
  it('enforces exp', async () => {
    const verifier = new JwtVerifier({
      keys: [standardKey]
    });
    let err;
    try {
      await verifier.verify(expiredToken);
    } catch (e) {
      err = e;
    } finally {
      expect(err).toEqual(new Error('expired token'));
    }
  });
  it('allows ignoring exp', async () => {
    const verifier = new JwtVerifier({
      keys: [standardKey]
    });
    expect(await verifier.verify(expiredToken, {
      expiration: Infinity
    })).toEqual(expiredClaims);
  });
});
