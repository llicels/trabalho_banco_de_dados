from typing import Any
import psycopg2
from psycopg2.extras import DictCursor
from psycopg2.errors import IntegrityError
import traceback


class DatabaseManager:
    "Classe de Gerenciamento do database"

    def __init__(self) -> None:
        self.conn = psycopg2.connect(
            dbname="UPA",
            user="postgres",
            password="Lost02",
            host="127.0.0.1",
            port=5432,
        )
        self.cursor = self.conn.cursor(cursor_factory=DictCursor)

    def execute_statement(self, statement: str) -> bool:
        "Usado para Inserções, Deleções, Alter Tables"
        try:
            self.cursor.execute(statement)
            self.conn.commit()
        except IntegrityError as e:
            print(f"Integrity error: {e}")
            print("Failed statement:", statement)
            print(traceback.format_exc())
            try:
                self.conn.rollback()
            except Exception:
                pass
            return False
        except:
            print("Unexpected error executing statement")
            print("Failed statement:", statement)
            print(traceback.format_exc())
            try:
                self.conn.rollback()
            except Exception:
                pass
            return False
        return True

    def execute_select_all(self, query: str) -> list[dict[str, Any]]:
        "Usado para SELECTS no geral"
        self.cursor.execute(query)
        return [dict(item) for item in self.cursor.fetchall()]

    def execute_select_one(self, query: str) -> dict | None:
        "Usado para SELECT com apenas uma linha de resposta"
        self.cursor.execute(query)
        query_result = self.cursor.fetchone()

        if not query_result:
            return None

        return dict(query_result)
