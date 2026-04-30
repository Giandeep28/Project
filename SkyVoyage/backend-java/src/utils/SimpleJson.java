package utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * A minimal, dependency-free JSON utility for the SkyVoyage Core Engine.
 */
public class SimpleJson {

    public static Map<String, Object> parseObject(String json) {
        return new Parser(json).parseObject();
    }

    public static List<Object> parseArray(String json) {
        return new Parser(json).parseArray();
    }

    public static String stringify(Object obj) {
        if (obj == null) return "null";
        if (obj instanceof String) return "\"" + ((String) obj).replace("\"", "\\\"") + "\"";
        if (obj instanceof Number || obj instanceof Boolean) return obj.toString();
        if (obj instanceof List) {
            StringBuilder sb = new StringBuilder("[");
            List<?> list = (List<?>) obj;
            for (int i = 0; i < list.size(); i++) {
                sb.append(stringify(list.get(i)));
                if (i < list.size() - 1) sb.append(",");
            }
            sb.append("]");
            return sb.toString();
        }
        if (obj instanceof Map) {
            StringBuilder sb = new StringBuilder("{");
            Map<?, ?> map = (Map<?, ?>) obj;
            int i = 0;
            for (Map.Entry<?, ?> entry : map.entrySet()) {
                sb.append("\"").append(entry.getKey()).append("\":").append(stringify(entry.getValue()));
                if (i < map.size() - 1) sb.append(",");
                i++;
            }
            sb.append("}");
            return sb.toString();
        }
        return "\"" + obj.toString() + "\"";
    }

    private static class Parser {
        private final String src;
        private int pos = 0;

        public Parser(String src) { this.src = src.trim(); }

        public Map<String, Object> parseObject() {
            Map<String, Object> map = new HashMap<>();
            consume('{');
            while (peek() != '}') {
                skipWhitespace();
                String key = parseString();
                skipWhitespace();
                consume(':');
                Object val = parseValue();
                map.put(key, val);
                skipWhitespace();
                if (peek() == ',') consume(',');
            }
            consume('}');
            return map;
        }

        public List<Object> parseArray() {
            List<Object> list = new ArrayList<>();
            consume('[');
            while (peek() != ']') {
                list.add(parseValue());
                skipWhitespace();
                if (peek() == ',') consume(',');
            }
            consume(']');
            return list;
        }

        private Object parseValue() {
            skipWhitespace();
            char c = peek();
            if (c == '{') return parseObject();
            if (c == '[') return parseArray();
            if (c == '"') return parseString();
            if (c == 't') { consume("true"); return true; }
            if (c == 'f') { consume("false"); return false; }
            if (c == 'n') { consume("null"); return null; }
            return parseNumber();
        }

        private String parseString() {
            consume('"');
            StringBuilder sb = new StringBuilder();
            while (pos < src.length() && peek() != '"') {
                char c = next();
                if (c == '\\') {
                    char next = next();
                    if (next == 'n') sb.append('\n');
                    else if (next == 't') sb.append('\t');
                    else sb.append(next);
                } else sb.append(c);
            }
            consume('"');
            return sb.toString();
        }

        private Double parseNumber() {
            StringBuilder sb = new StringBuilder();
            while (pos < src.length() && (Character.isDigit(peek()) || peek() == '.' || peek() == '-')) {
                sb.append(next());
            }
            return Double.parseDouble(sb.toString());
        }

        private void skipWhitespace() {
            while (pos < src.length() && Character.isWhitespace(src.charAt(pos))) pos++;
        }

        private char peek() { skipWhitespace(); return pos < src.length() ? src.charAt(pos) : 0; }
        private char next() { return src.charAt(pos++); }
        private void consume(char c) { if (next() != c) throw new RuntimeException("Expected " + c + " at pos " + pos); }
        private void consume(String s) { for (char c : s.toCharArray()) consume(c); }
    }
}
