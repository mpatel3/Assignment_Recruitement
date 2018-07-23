# Assignment_Recruitement

1. To Run the project you will going to require any local server. 
2. I have used http-server.
3. After cloning, cd to the directory and run `npm install -g http-server`.
    * Note: For this command to run proper you will going to require npm and node.
    * make sure they are installed.
4. After you installed http-server run `http-server -o` command to start your server.


**Features which are implemented**
1. Column Level Sorting
2. Ascending and Descending arrow based on Sorting
3. Page level Filtering
4. Pagination
5. Column Level Filtering
6. Implemented scenario : if one of the key's value is object - implemented using modal-popup.
    * Once you open page click on "Show more" to show pop-up.
7. Table is fully customizable and dynamic.
    * e.g. : If you do not want column level filtering then set value of flag `isColumnLevelFilter` to `false` in starting of the code.
    * similarly if you do not want column level sorting then set value of flag `isColumnlevelSort` to `false` in starting of the code.
    * If you do not want pagination then set value of flag `pagiNation` to `false` in starting of the code.
8. Table is bit responsive as well.
9. Used technology : Vanila JS and Bootstrap.


**Note:**
1. Column level filtering will going to work only for one column meaning if you type something in filter of column-1 and then you type something in filter of column-2 then filter will not going to happen based on both the values. This is bug : currently I am working on that solution.
2. http-server might not get refershed content on browser if you hit refersh. So , when you change something in code make sure to hit refersh (`ctrl+shift+r`) few times to check your changes.
