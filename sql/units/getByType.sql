select uid, name, username, is_branch, is_kitchen from units
where is_branch = ${is_branch} and lower(username)<>'admin'