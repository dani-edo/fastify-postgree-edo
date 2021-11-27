alter table notes
add column user_id uuid not null;

alter table notes
add constraint fk_user_id_notes foreign key(user_id) references users(id);

create index idx_users_notes ON notes(user_id);