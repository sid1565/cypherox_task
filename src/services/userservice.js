import bcrypt from 'bcryptjs';
import db from '../config/config.js';
import jwt from 'jsonwebtoken';
import Dotenv from 'dotenv';
Dotenv.config();

  /* ************************* user registration ********************************** */
  export async function register(body) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(body.password, salt);

      const { rows: emailChecking } = await db.query(
        "SELECT * FROM users WHERE email = $1",
        [body.email]
      );
      
      const emailCheck = emailChecking[0];
      
      if (emailCheck) {
        throw new Error("USER_WITH_EMAIL_ALREADY_EXISTS");
      }

      const { rows: insertRows } = await db.query(
        "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
        [
          body.email,
          hashedPassword
        ]
      );
      const newUser = insertRows[0];
      console.log("New User ===========", newUser);
      
      const { rows: selectRows } = await db.query(
        "SELECT * FROM users WHERE email = $1",
        [body.email]
      );
      const userData = selectRows[0];
      console.log("userData ===========", userData);
      return userData;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  export async function userLogin(body) {
    try {
        const { rows: emailChecking } = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [body.email]
          );
          
        const user = emailChecking[0];
        console.log("EMAILL_CHECK++", user);
        
        if(!user) {
            throw new Error("USER_NOT_FOUND");
        }
        if(!(await bcrypt.compare(body.password, user.password))) {
            throw new Error("INVALID_PASSWORD");
        }

        const token = jwt.sign({ userId: user.id}, process.env.JWT_SECRET, { expiresIn: '24h' });

        await db.query(
            "UPDATE users SET auth_token = $1 WHERE id = $2",
            [token, user.id]
          );

        return token;
        
    } catch (error) {
        return Promise.reject(error);
    }
  }

  export async function create_task(body, user_id) {
      try {
        const { title, description, status } = body;
        const { rows } = await db.query(
          `INSERT INTO tasks (title, description, status, user_id)
           VALUES ($1, $2, $3, $4)
           RETURNING *`,
          [title, description, status || 'To-Do', user_id]  // default status if not given
        );
    
        const newTask = rows[0];

        return newTask;
      } catch (error) {
          return Promise.reject(error);
      }
  }

  export async function get_all_task(user_id) {
      try {
        const { rows } = await db.query(
          `SELECT * FROM tasks WHERE user_id = $1`,
          [user_id] 
        );

        return rows;
      } catch (error) {
          return Promise.reject(error);
      }
  }

  export async function update_task(body, user_id) {
    try {
      const { title, description, status, task_id } = body;
  
      const updates = [];
    const values = [];
    let idx = 1;

    if (title !== undefined) {
      updates.push(`title = $${idx++}`);
      values.push(title);
    }
    if (description !== undefined) {
      updates.push(`description = $${idx++}`);
      values.push(description);
    }
    if (status !== undefined) {
      updates.push(`status = $${idx++}`);
      values.push(status);
    }

    if (updates.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(task_id);
    values.push(user_id);

    const updateQuery = `
      UPDATE tasks
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${idx++} AND user_id = $${idx}
      RETURNING *;
    `;

    const { rows } = await db.query(updateQuery, values);
    const updatedTask = rows[0];

    return updatedTask;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function delete_task(body, user_id) {
  try {
    const { task_id }= body;
    const { rows } = await db.query(
      `DELETE FROM tasks WHERE id = $1`,
      [task_id] 
    );

    return rows;
  } catch (error) {
      return Promise.reject(error);
  }
}
