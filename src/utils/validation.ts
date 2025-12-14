export const validate = {
  /** --------------------------------------------------
   * REQUIRED
   * -------------------------------------------------- */
  required(value: any, field: string) {
    if (value === null || value === undefined || value.toString().trim() === "") {
      throw new Error(`${field} không được để trống`);
    }
  },

  /** --------------------------------------------------
   * LENGTH LIMITS
   * -------------------------------------------------- */
  min(value: string, minLen: number, field?: string) {
    if (value && value.trim().length < minLen) {
      throw new Error(
        field
          ? `${field} phải từ ${minLen} ký tự`
          : `Độ dài tối thiểu là ${minLen}`
      );
    }
  },

  max(value: string, maxLen: number, field?: string) {
    if (value && value.trim().length > maxLen) {
      throw new Error(
        field
          ? `${field} tối đa ${maxLen} ký tự`
          : `Độ dài tối đa là ${maxLen}`
      );
    }
  },

  lengthExactly(value: string, len: number, field?: string) {
    if (value && value.trim().length !== len) {
      throw new Error(
        field
          ? `${field} phải đúng ${len} ký tự`
          : `Độ dài phải chính xác ${len}`
      );
    }
  },

  /** --------------------------------------------------
   * EMAIL
   * -------------------------------------------------- */
  email(value: string) {
    const re = /\S+@\S+\.\S+/;
    if (!re.test(value.trim())) {
      throw new Error("Email không hợp lệ");
    }
  },

  /** --------------------------------------------------
   * PHONE (10–11 digits)
   * -------------------------------------------------- */
  phone(value: string) {
    const v = value.trim();
    if (!/^[0-9]{10,11}$/.test(v)) {
      throw new Error("Số điện thoại phải từ 10–11 số");
    }
  },

  /** --------------------------------------------------
   * PASSWORD (>= 6 chars)
   * -------------------------------------------------- */
  password(value: string) {
    if (value.trim().length < 6) {
      throw new Error("Mật khẩu phải từ 6 ký tự trở lên");
    }
  },

  /** --------------------------------------------------
   * NUMBER VALIDATION
   * -------------------------------------------------- */
  number(value: any, field: string) {
    if (value === null || value === undefined || value === "") return;
    if (isNaN(Number(value))) {
      throw new Error(`${field} phải là số`);
    }
  },

  integer(value: any, field: string) {
    if (!Number.isInteger(Number(value))) {
      throw new Error(`${field} phải là số nguyên`);
    }
  },

  positive(value: any, field: string) {
    if (Number(value) <= 0) {
      throw new Error(`${field} phải lớn hơn 0`);
    }
  },

  nonNegative(value: any, field: string) {
    if (Number(value) < 0) {
      throw new Error(`${field} không được âm`);
    }
  },

  inRange(value: any, min: number, max: number, field: string) {
    const n = Number(value);
    if (n < min || n > max) {
      throw new Error(`${field} phải nằm trong khoảng ${min} - ${max}`);
    }
  },

  /** --------------------------------------------------
   * ENUM VALIDATION
   * -------------------------------------------------- */
  enum(value: any, arr: any[], field: string) {
    if (!arr.includes(value)) {
      throw new Error(`${field} không hợp lệ`);
    }
  },

  /** --------------------------------------------------
   * PATTERN (GENERAL REGEX)
   * -------------------------------------------------- */
  pattern(value: string, regex: RegExp, field: string) {
    if (!regex.test(value)) {
      throw new Error(`${field} không hợp lệ`);
    }
  },

  /** --------------------------------------------------
   * WORD COUNT
   * -------------------------------------------------- */
  maxWords(value: string, maxWords: number, field: string) {
    const count = value.trim().split(/\s+/).length;
    if (count > maxWords) {
      throw new Error(`${field} không được vượt quá ${maxWords} từ`);
    }
  },

  /** --------------------------------------------------
   * SPECIAL CHAR FILTER (for username, slug,…)
   * -------------------------------------------------- */
  noSpecialChars(value: string, field: string) {
    if (!/^[A-Za-z0-9 _-]+$/.test(value.trim())) {
      throw new Error(`${field} không được chứa ký tự đặc biệt`);
    }
  },

  /** --------------------------------------------------
   * Utils
   * -------------------------------------------------- */
  trim(v: string) {
    return v.trim();
  },

  normalizeName({ full_name, first_name, last_name }: any) {
    full_name = full_name?.trim() || null;
    first_name = first_name?.trim() || null;
    last_name = last_name?.trim() || null;

    if (!full_name && (first_name || last_name)) {
      full_name = [first_name, last_name].filter(Boolean).join(" ").trim();
    }

    if (full_name && (!first_name || !last_name)) {
      const parts = full_name.split(/\s+/);
      first_name = parts[0] || null;
      last_name = parts.length > 1 ? parts.slice(1).join(" ") : null;
    }

    return { full_name, first_name, last_name };
  },

  uuid(value: string, field: string = "ID") {
    const v = value?.trim();

    // Regex chuẩn UUID v1–v5
    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

    if (!uuidRegex.test(v)) {
      throw new Error(`${field} không phải UUID hợp lệ`);
    }
  }

};
