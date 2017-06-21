select uid, name, username, is_branch, is_kitchen from units
where is_branch = ${is_branch} and is_kitchen = ${is_kitchen} and lower(username)<>'admin'