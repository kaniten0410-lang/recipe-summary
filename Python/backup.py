import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd
import os
import sys
import datetime

# input処理
def yes_no(prompt: str) -> bool:
    while True:
        print(prompt)
        print("はい：y いいえ:n")
        user_input = input(":").strip().lower()

        if user_input == "y":
            return True
        elif user_input == "n":
            return False

        print("yかnを入力してください")
# ---------------------------------------------------------------------------- #
#                                      挨拶                                    #
# ---------------------------------------------------------------------------- #
print("Backupツールです\n")

if not yes_no("Backupしますか？"):
    print("やめておきます")
    sys.exit(0)

# ---------------------------------------------------------------------------- #
#                                  重複チェック                                 #
# ---------------------------------------------------------------------------- #
# 日付取得
dt = datetime.date.today()
# パス取得
base_dir = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(base_dir, "../backup", f"backup_{dt}.csv")

if os.path.exists(csv_path):
    print("既に同じ日付のファイルがある様子です")
    if not yes_no("上書きしますか？"):
        print("やめておきます")
        sys.exit(0)

# ---------------------------------------------------------------------------- #
#                                  Firebase処理                                #
# ---------------------------------------------------------------------------- #
# Firebase認証
key_path = os.path.join(base_dir, "..", "serviceAccountKey.json")
try:
    cred = credentials.Certificate(key_path)
except Exception as e:
    print(f"jsonファイルの読み込みに失敗しました：{e}")
    sys.exit(1)

# 初期化
try:
    firebase_admin.get_app()
except ValueError:
    firebase_admin.initialize_app(cred)

# DB操作準備
db = firestore.client()


# ---------------------------------------------------------------------------- #
#                                     DF変換                                   #
# ---------------------------------------------------------------------------- #
# データ取得
docs = db.collection("recipes").stream()

# リストに変換
data = []
for doc in docs:
    row = doc.to_dict()
    data.append(row)

# Dfに変換
df = pd.DataFrame(data)

# ---------------------------------------------------------------------------- #
#                                     csv保存                                   #
# ---------------------------------------------------------------------------- #
df.to_csv(csv_path, index=False, encoding="utf-8-sig")

# 挨拶
print(f"backup_{dt}.csv を保存しました")