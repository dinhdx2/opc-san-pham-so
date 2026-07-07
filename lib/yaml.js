'use strict'
// lib/yaml.js — trình nạp YAML tối-giản, KHÔNG phụ-thuộc package ngoài.
//
// Vì sao tự viết: môi-trường web/Claude Code không bảo-đảm có `js-yaml`. Bộ rule-engine
// (spec 06) + taxonomy (spec 04) yêu-cầu dữ-liệu sống ở `knowledge/**/*.yaml` (config-as-data,
// bất-biến C4 "bảng/luật ở 1 nơi"). Loader này phủ ĐÚNG tập con YAML mà các file đó dùng:
//   - chuỗi-khối (block sequence) các ánh-xạ:  "- key: value"
//   - ánh-xạ-khối (block mapping) lồng 1 cấp:  "key:\n  sub: value"
//   - danh-sách phẳng (block sequence vô-hướng): "- a\n- b"
//   - flow list nội-dòng:  "key: [a, b, c]"
//   - vô-hướng: chuỗi (có/không nháy), số, bool, null
//   - chú-thích `#` (ngoài chuỗi nháy) + dòng trống
//
// KHÔNG hỗ-trợ: anchor/alias, multi-doc, block scalar (| >), map lồng sâu >2. Mọi file config
// trong repo này được giữ trong tập con trên (test `lib/__tests__` kiểm round-trip).

function stripComment(line) {
  // bỏ `#...` nếu # nằm ngoài chuỗi nháy
  let inS = false, inD = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === "'" && !inD) inS = !inS
    else if (c === '"' && !inS) inD = !inD
    else if (c === '#' && !inS && !inD) {
      // chỉ coi là chú-thích khi có khoảng trắng trước (hoặc đầu dòng)
      if (i === 0 || /\s/.test(line[i - 1])) return line.slice(0, i)
    }
  }
  return line
}

function parseScalar(raw) {
  const s = raw.trim()
  if (s === '' || s === '~' || s === 'null') return null
  if (s === 'true') return true
  if (s === 'false') return false
  if ((s[0] === '"' && s[s.length - 1] === '"') || (s[0] === "'" && s[s.length - 1] === "'")) {
    return s.slice(1, -1)
  }
  if (s[0] === '[' && s[s.length - 1] === ']') return parseFlowList(s)
  if (/^-?\d+$/.test(s)) return parseInt(s, 10)
  if (/^-?\d*\.\d+$/.test(s)) return parseFloat(s)
  return s
}

function parseFlowList(s) {
  const body = s.slice(1, -1).trim()
  if (body === '') return []
  const out = []
  let cur = '', inS = false, inD = false, depth = 0
  for (let i = 0; i < body.length; i++) {
    const c = body[i]
    if (c === "'" && !inD) inS = !inS
    else if (c === '"' && !inS) inD = !inD
    else if (!inS && !inD && c === '[') depth++
    else if (!inS && !inD && c === ']') depth--
    if (c === ',' && !inS && !inD && depth === 0) { out.push(parseScalar(cur)); cur = ''; continue }
    cur += c
  }
  if (cur.trim() !== '') out.push(parseScalar(cur))
  return out
}

// Tách value sau "key:" — value có-thể rỗng (mở block con) hoặc vô-hướng/flow-list.
function splitKeyValue(content) {
  // tìm dấu ':' đầu-tiên nằm ngoài nháy/flow
  let inS = false, inD = false, depth = 0
  for (let i = 0; i < content.length; i++) {
    const c = content[i]
    if (c === "'" && !inD) inS = !inS
    else if (c === '"' && !inS) inD = !inD
    else if (!inS && !inD && (c === '[' )) depth++
    else if (!inS && !inD && (c === ']')) depth--
    else if (c === ':' && !inS && !inD && depth === 0) {
      const after = content[i + 1]
      if (after === undefined || after === ' ' || after === '\t') {
        return [content.slice(0, i).trim(), content.slice(i + 1).trim()]
      }
    }
  }
  return null
}

function indentOf(line) {
  let n = 0
  while (n < line.length && line[n] === ' ') n++
  return n
}

// Phân-tích đệ-quy theo khối thụt-lề.
function parseBlock(lines, start, end, indent) {
  // Quyết-định: sequence (bắt đầu '-') hay mapping
  let i = start
  while (i < end && lines[i].text.trim() === '') i++
  if (i >= end) return null
  const first = lines[i]
  if (first.indent === indent && first.text.trim().startsWith('- ')) {
    return parseSequence(lines, start, end, indent)
  }
  return parseMapping(lines, start, end, indent)
}

function parseSequence(lines, start, end, indent) {
  const out = []
  let i = start
  while (i < end) {
    const ln = lines[i]
    if (ln.text.trim() === '') { i++; continue }
    if (ln.indent < indent) break
    if (ln.indent !== indent || !ln.text.trim().startsWith('-')) { i++; continue }
    const rest = ln.text.trim().slice(1).trim() // sau '-'
    // tìm phạm-vi item: tới dòng kế cùng indent bắt đầu '-' hoặc indent nhỏ hơn
    let j = i + 1
    while (j < end) {
      const t = lines[j]
      if (t.text.trim() === '') { j++; continue }
      if (t.indent < indent) break
      if (t.indent === indent && t.text.trim().startsWith('-')) break
      j++
    }
    if (rest === '') {
      out.push(parseBlock(lines, i + 1, j, indent + 2))
    } else {
      const kv = splitKeyValue(rest)
      if (kv) {
        // item là mapping bắt đầu ngay trên dòng '-'
        const childIndent = ln.indent + 2
        // dựng mapping ảo: dòng đầu (rest) + các dòng con
        const synthetic = [{ indent: childIndent, text: ' '.repeat(childIndent) + rest }]
        for (let k = i + 1; k < j; k++) synthetic.push(lines[k])
        out.push(parseMapping(synthetic, 0, synthetic.length, childIndent))
      } else {
        out.push(parseScalar(rest))
      }
    }
    i = j
  }
  return out
}

function parseMapping(lines, start, end, indent) {
  const obj = {}
  let i = start
  while (i < end) {
    const ln = lines[i]
    if (ln.text.trim() === '') { i++; continue }
    if (ln.indent < indent) break
    if (ln.indent !== indent) { i++; continue }
    const kv = splitKeyValue(ln.text.trim())
    if (!kv) { i++; continue }
    const [key, val] = kv
    if (val === '') {
      // block con: tìm phạm-vi
      let j = i + 1
      while (j < end) {
        const t = lines[j]
        if (t.text.trim() === '') { j++; continue }
        if (t.indent <= indent) break
        j++
      }
      obj[key] = parseBlock(lines, i + 1, j, indent + 2)
      i = j
    } else {
      obj[key] = parseScalar(val)
      i++
    }
  }
  return obj
}

function parse(text) {
  const rawLines = text.split(/\r?\n/)
  const lines = []
  for (const raw of rawLines) {
    const noComment = stripComment(raw)
    if (noComment.trim() === '' || noComment.trim() === '---') {
      lines.push({ indent: 0, text: '' })
      continue
    }
    lines.push({ indent: indentOf(noComment), text: noComment.replace(/\s+$/, '') })
  }
  const result = parseBlock(lines, 0, lines.length, 0)
  return result === null ? {} : result
}

function load(filePath) {
  const fs = require('fs')
  return parse(fs.readFileSync(filePath, 'utf8'))
}

module.exports = { parse, load, parseFlowList, parseScalar }
