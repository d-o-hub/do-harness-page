/**
 * Task 18 probe: render the Install section's two checksum states with
 * react-dom/server under bun (no browser needed) and assert both branches.
 * The null branch is unreachable in the live build while upstream is up,
 * so this is the honest way to verify the degraded line renders.
 */
import { renderToString } from 'react-dom/server'
import { Install } from '../src/components/site/install'

const fakeHash = 'ab'.repeat(32)

const degraded = renderToString(<Install scriptChecksum={null} />)
const ok1 = degraded.includes('sha256 unavailable')
const ok2 = degraded.includes('shasum -a 256')
console.log(
  ok1 && ok2
    ? 'PASS: null branch renders degraded checksum line'
    : `FAIL: null branch missing degraded copy (${ok1}/${ok2})`,
)

const success = renderToString(
  <Install scriptChecksum={{ hash: fakeHash, fetchedAt: '18:09' }} />,
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
