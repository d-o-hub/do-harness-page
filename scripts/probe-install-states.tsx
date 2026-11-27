/**
 * Task 18 probe: render the Install section's checksum and release-version
 * states with react-dom/server under bun (no browser needed) and assert every
 * branch. The null/degraded branches are unreachable in the live build while
 * upstream is up, so this is the honest way to verify the degraded lines
 * render.
 */
import { renderToString } from 'react-dom/server'
import { Install } from '../src/components/site/install'

const fakeHash = 'ab'.repeat(32)

const degraded = renderToString(
  <Install scriptChecksum={null} latestVersion={null} />,
)
const ok1 = degraded.includes('sha256 unavailable')
const ok2 = degraded.includes('shasum -a 256')
console.log(
  ok1 && ok2
    ? 'PASS: null branch renders degraded checksum line'
    : `FAIL: null branch missing degraded copy (${ok1}/${ok2})`,
)

const success = renderToString(
  <Install
    scriptChecksum={{ hash: fakeHash, fetchedAt: '18:09' }}
    latestVersion={null}
  />,
)
// React separates adjacent text nodes with <!-- --> markers in SSR output.
const clean = success.replace(/<!--.*?-->/g, '')
const ok3 = /fetched\s+18:09\s+UTC/.test(clean)
const ok4 = success.includes(fakeHash)
const ok5 = success.includes('sha256') && !success.includes('sha256 unavailable')
console.log(
  ok3 && ok4 && ok5
    ? 'PASS: success row renders hash + as-of stamp, no degraded copy'
    : `FAIL: success row wrong (${ok3}/${ok4}/${ok5})`,
)

const versioned = renderToString(
  <Install
    scriptChecksum={null}
    latestVersion={'v0.6.0'}
  />,
)
const ok6 = versioned.includes('data-release-version="v0.6.0"')
const ok7 = versioned.includes('/releases/tag/v0.6.0')
console.log(
  ok6 && ok7
    ? 'PASS: known release renders the versioned Source entry + marker'
    : `FAIL: versioned Source entry wrong (${ok6}/${ok7})`,
)

const versionless = renderToString(
  <Install scriptChecksum={null} latestVersion={null} />,
)
const ok8 = versionless.includes('Compile the current release')
const ok9 = !versionless.includes('data-release-version')
console.log(
  ok8 && ok9
    ? 'PASS: null release renders the versionless Source fallback, no marker'
    : `FAIL: versionless Source fallback wrong (${ok8}/${ok9})`,
)
